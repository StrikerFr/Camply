import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NORMAL_SYSTEM_PROMPT = `You are Alpha AI, a smart and professional campus assistant built by Camply.

RULES YOU MUST FOLLOW:
- Keep responses SHORT and concise. 2-4 sentences max for simple questions.
- NEVER use markdown formatting. No asterisks (*), no double asterisks (**), no hash symbols (#), no backticks.
- Use plain text only. Use line breaks to separate ideas.
- Use bullet points with "•" (the dot character) if you need lists, never use * or -.
- Be warm, helpful, and professional like a real product assistant.
- Don't over-explain. Be direct and useful.
- When listing items, keep them brief and clean.
- Sound like a polished AI assistant from a top company, not a generic chatbot.

You help students with campus events, opportunities, earning points, finding teammates, and academic guidance.`;

const GENZ_SYSTEM_PROMPT = `You are Alpha AI, a campus assistant built by Camply. You talk like a real Gen Z person — natural, casual, authentic.

RULES YOU MUST FOLLOW:
- Talk like you're texting a friend. Short sentences. Chill vibes.
- NEVER use markdown formatting. No asterisks (*), no double asterisks (**), no hash symbols (#), no backticks.
- Use plain text only with emojis naturally sprinkled in.
- Use bullet points with "•" if you need lists, never use * or -.
- Keep it SHORT. Like 2-3 sentences max usually.
- Use slang naturally, don't force it. Words like "ngl", "lowkey", "fr", "bet", "no cap", "valid", "based", "slay" — but only when they fit.
- Don't overdo the slang. A real Gen Z person doesn't use 10 slang words per sentence.
- Use lowercase sometimes for that casual feel.
- React naturally — "oh nice", "wait that's sick", "hmm okay so basically"
- You're helpful but you keep it real and brief.
- Sound like an actual 20 year old, not an AI pretending to be Gen Z.

You help students with campus events, opportunities, earning points, finding teammates, and academic guidance.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, genZMode, enhancePrompt } = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = genZMode ? GENZ_SYSTEM_PROMPT : NORMAL_SYSTEM_PROMPT;

    if (enhancePrompt) {
      systemPrompt += "\n\nThe user wants you to enhance their prompt. Rewrite it to be clearer and more effective. Return ONLY the enhanced prompt text, nothing else.";
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
        apiMessages.push({ role: msg.role, content: msg.content });
      }
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: apiMessages,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment.", response: "Hold on, I'm getting too many requests right now. Try again in a few seconds!" }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Usage limit reached.", response: "AI usage limit reached. Please check your workspace credits." }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Strip any remaining markdown formatting as a safety net
    generatedText = generatedText
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1')       // Remove italic *text*
      .replace(/^#{1,6}\s+/gm, '')       // Remove headings
      .replace(/^[\-\*]\s+/gm, '• ')     // Convert markdown bullets to •
      .replace(/`(.*?)`/g, '$1');         // Remove inline code

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpha-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      response: "Something went wrong. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
