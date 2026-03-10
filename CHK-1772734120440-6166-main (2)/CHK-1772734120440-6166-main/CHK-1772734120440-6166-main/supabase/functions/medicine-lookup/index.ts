import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("AIzaSyCasYu9hCzL61Lp49T2E5LBP0dHm2X_ErY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    };
    const langName = langMap[language] || "English";

    const systemPrompt = `You are a medicine information assistant for elderly users. Given a medicine name or barcode, provide detailed medicine information in ${langName} language. 

IMPORTANT: Always respond in ${langName}.

Return a JSON object with this exact structure:
{
  "name": "medicine name with strength",
  "brand": "common brand name",
  "type": "Tablet/Capsule/Syrup/etc",
  "uses": ["use 1", "use 2", "use 3", "use 4"],
  "dosage": "clear dosage instructions in simple language",
  "sideEffects": ["side effect 1", "side effect 2", "side effect 3"],
  "warnings": ["warning 1", "warning 2", "warning 3"],
  "food": ["food instruction 1", "food instruction 2", "food instruction 3"]
}

Use simple, easy-to-understand language suitable for elderly people. Be accurate with medical information but explain in layman's terms.`;

    const response = await fetch(
     https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Provide detailed medicine information for: "${query}"`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "provide_medicine_info",
                description: "Return structured medicine information",
                parameters: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    brand: { type: "string" },
                    type: { type: "string" },
                    uses: {
                      type: "array",
                      items: { type: "string" },
                    },
                    dosage: { type: "string" },
                    sideEffects: {
                      type: "array",
                      items: { type: "string" },
                    },
                    warnings: {
                      type: "array",
                      items: { type: "string" },
                    },
                    food: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "name",
                    "brand",
                    "type",
                    "uses",
                    "dosage",
                    "sideEffects",
                    "warnings",
                    "food",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "provide_medicine_info" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call response from AI");
    }

    const medicineInfo = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(medicineInfo), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("medicine-lookup error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
