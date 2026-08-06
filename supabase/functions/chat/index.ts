// Golden Tours AI — Claude API proxy (Supabase Edge Function)
// Keeps the Anthropic key server-side. Verifies the caller is an authenticated
// Golden Tours user before spending on the API. Grounds every reply in our
// real destinations/packages catalog so recommendations are never generic.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Jua, the AI travel consultant for Golden Tours, a premium tour operator specialized EXCLUSIVELY in East Africa: Tanzania, Kenya, Uganda, Rwanda, and Zanzibar.

Non-negotiable rules:
1. Always answer the traveler's actual question directly and accurately — never dodge, never go generic.
2. Fully address every specific detail they give you (budget, number of travelers, trip length, season/month, interests). Do not ignore any constraint they state.
3. Stay strictly inside East Africa tourism. If someone asks about a destination outside Tanzania, Kenya, Uganda, Rwanda, or Zanzibar, politely redirect them to a comparable East African experience — never answer with a non-East-African destination.
4. Base recommendations on realistic logistics: real parks, real seasons (e.g. the wildebeest migration river crossings are roughly July–September in the northern Serengeti/Mara, calving season is Jan–Mar in the southern Serengeti; gorilla trekking permits cost far more in Rwanda than Uganda; Kilimanjaro climbs need 6-9 days for safe acclimatization; Zanzibar's dry/best beach months are June–Oct and Dec–Feb).
5. Prefer recommending Golden Tours' own catalog (given to you below as CATALOG) when it fits — mention the exact package title or destination name so the traveler can find it. You may still give general expert advice beyond the catalog when useful, as long as it stays East African.
6. Ask a clarifying question ONLY if you genuinely cannot give a useful answer without it (e.g. they say "plan me a trip" with zero details). If they've already given enough to work with, don't stall with questions — give real recommendations.
7. Never give generic "top 10 world destinations" style answers. Every answer must be specific to East Africa.
8. Keep responses warm, expert, and concise — a knowledgeable consultant, not a wall of text. Use short paragraphs or a tight bullet list. Include approximate USD price ranges and durations when recommending a trip or package.

CATALOG (Golden Tours' real current destinations and packages — reference these by exact name when relevant):
{{CATALOG}}`;

function buildCatalogText(destinations: any[], packages: any[]) {
  const destLines = destinations
    .map((d) => `- ${d.name} (${d.country}, ${d.category}): ${d.short_description} Best season: ${d.best_season}.`)
    .join("\n");
  const pkgLines = packages
    .map(
      (p) =>
        `- "${p.title}" — ${p.duration_days} days, ${p.budget_level}, $${p.price_min}-$${p.price_max} per person, countries: ${p.countries?.join(
          ", "
        )}, interests: ${p.interests?.join(", ")}. ${p.description}`
    )
    .join("\n");
  return `DESTINATIONS:\n${destLines}\n\nPACKAGES:\n${pkgLines}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, mode } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      mode?: "chat" | "planner";
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [{ data: destinations }, { data: packages }] = await Promise.all([
      supabase.from("destinations").select("name,country,category,short_description,best_season"),
      supabase
        .from("packages")
        .select("title,duration_days,budget_level,price_min,price_max,countries,interests,description"),
    ]);

    const systemPrompt = SYSTEM_PROMPT.replace(
      "{{CATALOG}}",
      buildCatalogText(destinations ?? [], packages ?? [])
    );

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI is not configured yet" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const maxTokens = mode === "planner" ? 500 : 900;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((block: any) => block.type === "text");
    const reply = textBlock ? (textBlock as any).text : "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "AI request failed", detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
