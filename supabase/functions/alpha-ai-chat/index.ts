import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, genZMode, enhancePrompt, imageBase64 } = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = genZMode
      ? `You are Alpha AI, a super chill and helpful campus assistant that speaks in Gen Z style! Use slang like "no cap", "fr fr", "lowkey", "highkey", "slay", "based", "bet", "vibes", "bussin", "goated", "on god", "deadass", "sus", "it's giving", "periodt", "the tea", "rent free", "stan", "main character energy". Be enthusiastic with emojis! 🔥💀✨ Keep it fun and relatable while still being helpful!`
      : `You are Alpha AI, a professional and helpful campus assistant by Camply. You help students with information about campus events, opportunities, earning points, finding teammates, and general academic guidance. Be clear, concise, and helpful in your responses.`;

    if (enhancePrompt) {
      systemPrompt += "\n\nIMPORTANT: The user wants you to enhance/improve their prompt. Take their input and rewrite it to be clearer, more specific, and more effective for getting better AI responses. Return ONLY the enhanced prompt, nothing else.";
    }

    const apiMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    for (const msg of messages) {
      if (msg.image) {
        apiMessages.push({
          role: msg.role,
          content: [
            { type: "text", text: msg.content || "What's in this image?" },
            { type: "image_url", image_url: { url: msg.image } }
          ]
        });
      } else {
        apiMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    console.log('Sending request to Lovable AI Gateway');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpha-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      response: "Sorry, something went wrong. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
