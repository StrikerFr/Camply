import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  points: number;
  team_size_min: number | null;
  team_size_max: number | null;
  location: string | null;
  is_featured: boolean;
}

interface UserProfile {
  interests: string[];
  skills: string[];
  course: string | null;
  year: string | null;
  pastCategories: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { opportunities, userProfile } = await req.json() as {
      opportunities: Opportunity[];
      userProfile: UserProfile;
    };

    console.log("Received request with:", {
      opportunitiesCount: opportunities?.length,
      userProfile: userProfile,
    });

    if (!opportunities || opportunities.length === 0) {
      console.log("No opportunities to rank");
      return new Response(JSON.stringify({ rankedOpportunities: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt for AI ranking
    const systemPrompt = `You are an AI assistant that helps college students discover relevant campus opportunities. 
Your task is to rank and filter opportunities based on the student's profile.

IMPORTANT RULES:
- Only return opportunities that are relevant to the student
- Rank by relevance: interests match > skills match > past activity alignment > general fit
- Filter out opportunities that are clearly irrelevant (e.g., dance events for a pure tech student with no cultural interests)
- Consider the student's course and year when ranking
- Featured opportunities should get a small boost but not override relevance
- Return the opportunity IDs in order of relevance, most relevant first
- You must return at least 3 opportunities if available, even if not perfect matches`;

    const userPrompt = `Student Profile:
- Interests: ${userProfile.interests.length > 0 ? userProfile.interests.join(", ") : "None specified"}
- Skills: ${userProfile.skills.length > 0 ? userProfile.skills.join(", ") : "None specified"}  
- Course: ${userProfile.course || "Not specified"}
- Year: ${userProfile.year || "Not specified"}
- Past activity categories: ${userProfile.pastCategories.length > 0 ? userProfile.pastCategories.join(", ") : "No past activity"}

Available Opportunities:
${opportunities.map((opp, i) => `${i + 1}. [ID: ${opp.id}] "${opp.title}" - Category: ${opp.category}, Points: ${opp.points}, Featured: ${opp.is_featured}${opp.description ? `, Description: ${opp.description.substring(0, 100)}...` : ""}`).join("\n")}

Return the opportunity IDs ranked by relevance for this student.`;

    console.log("Calling AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "rank_opportunities",
              description: "Return the ranked list of opportunity IDs with relevance scores",
              parameters: {
                type: "object",
                properties: {
                  ranked_ids: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The opportunity ID" },
                        relevance_score: { type: "number", description: "Relevance score from 0-100" },
                        reason: { type: "string", description: "Brief reason for the ranking" },
                      },
                      required: ["id", "relevance_score", "reason"],
                    },
                  },
                },
                required: ["ranked_ids"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "rank_opportunities" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Fallback: return opportunities sorted by featured + date
      console.log("Falling back to default sort");
      return new Response(
        JSON.stringify({ 
          rankedOpportunities: opportunities.sort((a, b) => {
            if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the ranked IDs from the tool call response
    let rankedIds: { id: string; relevance_score: number; reason: string }[] = [];
    
    try {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        rankedIds = parsed.ranked_ids || [];
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
    }

    // Map ranked IDs back to full opportunity objects
    const opportunityMap = new Map(opportunities.map((o) => [o.id, o]));
    const rankedOpportunities = rankedIds
      .filter((r) => opportunityMap.has(r.id))
      .map((r) => ({
        ...opportunityMap.get(r.id)!,
        relevance_score: r.relevance_score,
        relevance_reason: r.reason,
      }));

    // Add any opportunities that weren't ranked (fallback)
    const rankedIdSet = new Set(rankedIds.map((r) => r.id));
    const unranked = opportunities
      .filter((o) => !rankedIdSet.has(o.id))
      .map((o) => ({ ...o, relevance_score: 0, relevance_reason: "Not ranked" }));

    const finalResult = [...rankedOpportunities, ...unranked];

    console.log("Returning", finalResult.length, "ranked opportunities");

    return new Response(JSON.stringify({ rankedOpportunities: finalResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in recommend-opportunities:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
