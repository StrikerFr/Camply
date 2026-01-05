import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, genZMode, enhancePrompt, imageBase64 } = await req.json();
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Build system prompt based on mode
    let systemPrompt = genZMode
      ? `You are Alpha AI, a super chill and helpful campus assistant that speaks in Gen Z style! Use slang like "no cap", "fr fr", "lowkey", "highkey", "slay", "based", "bet", "vibes", "bussin", "goated", "on god", "deadass", "sus", "it's giving", "periodt", "the tea", "rent free", "stan", "main character energy". Be enthusiastic with emojis! 🔥💀✨ Keep it fun and relatable while still being helpful!`
      : `You are Alpha AI, a professional and helpful campus assistant by Camply. You help students with information about campus events, opportunities, earning points, finding teammates, and general academic guidance. Be clear, concise, and helpful in your responses.`;

    // If enhancePrompt is requested, modify the behavior
    if (enhancePrompt) {
      systemPrompt += "\n\nIMPORTANT: The user wants you to enhance/improve their prompt. Take their input and rewrite it to be clearer, more specific, and more effective for getting better AI responses. Return ONLY the enhanced prompt, nothing else.";
    }

    // Build the messages array for the API
    const apiMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history
    for (const msg of messages) {
      if (msg.image) {
        // Message with image
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

    console.log('Sending request to OpenRouter with messages:', JSON.stringify(apiMessages.slice(-3)));

    // Try with multiple models in case of rate limiting
    const models = [
      'google/gemini-2.0-flash-exp:free',
      'google/gemini-flash-1.5-8b', // Fallback model
      'meta-llama/llama-3.2-3b-instruct:free', // Another free fallback
    ];

    let lastError = null;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://camply.lovable.app',
            'X-Title': 'Camply Alpha AI',
          },
          body: JSON.stringify({
            model: model,
            messages: apiMessages,
          }),
        });

        if (response.status === 429) {
          const errorText = await response.text();
          console.warn(`Rate limited on ${model}:`, errorText);
          lastError = `Rate limited on ${model}`;
          continue; // Try next model
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error on ${model}:`, response.status, errorText);
          lastError = `API error: ${response.status}`;
          continue; // Try next model
        }

        const data = await response.json();
        console.log('OpenRouter response:', JSON.stringify(data));
        
        const generatedText = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        return new Response(JSON.stringify({ response: generatedText }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError);
        lastError = modelError;
        continue;
      }
    }

    // All models failed
    return new Response(JSON.stringify({ 
      error: 'AI is temporarily busy. Please try again in a few seconds.',
      response: genZMode 
        ? "Ayo sorry fam! 😅 AI servers are lowkey overwhelmed rn. Try again in a sec, no cap! 🔥"
        : "I apologize, but I'm experiencing high traffic right now. Please try again in a moment."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpha-ai-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      response: "Sorry, something went wrong. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
