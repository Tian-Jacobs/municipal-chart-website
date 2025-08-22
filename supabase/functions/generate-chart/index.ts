
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AllowedFunction =
  | "complaints_by_category"
  | "complaints_by_ward"
  | "complaints_monthly"
  | "complaints_status";

type Plan = {
  function: AllowedFunction;
  start_date?: string | null;
  end_date?: string | null;
  chartType?: "bar" | "line" | "pie" | "doughnut";
  sql?: string;
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. Please add it in Supabase Edge Function Secrets.");
}
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("SUPABASE_URL or SUPABASE_ANON_KEY/SERVICE_ROLE_KEY missing in environment.");
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

const FUNCTION_TITLES: Record<AllowedFunction, string> = {
  complaints_by_category: "Complaints by Category",
  complaints_by_ward: "Complaints by Ward",
  complaints_monthly: "Monthly Complaints Trend",
  complaints_status: "Resolution Status Breakdown",
};

const FUNCTION_DEFAULT_CHART: Record<AllowedFunction, Plan["chartType"]> = {
  complaints_by_category: "bar",
  complaints_by_ward: "pie",
  complaints_monthly: "line",
  complaints_status: "doughnut",
};

function recommendChartType(fn: AllowedFunction, requested?: Plan["chartType"]) {
  return requested || FUNCTION_DEFAULT_CHART[fn] || "bar";
}

function safeParsePlan(text: string): Plan | null {
  // Extract first JSON object from the model's output
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(text.slice(start, end + 1));
    return obj;
  } catch {
    return null;
  }
}

function clampPlan(raw: any): Plan | null {
  const allowedFns: AllowedFunction[] = [
    "complaints_by_category",
    "complaints_by_ward",
    "complaints_monthly",
    "complaints_status",
  ];

  const fn = raw?.function as AllowedFunction;
  if (!allowedFns.includes(fn)) return null;

  const chartType = ((): Plan["chartType"] => {
    if (raw?.chartType && ["bar", "line", "pie", "doughnut"].includes(raw.chartType)) {
      return raw.chartType;
    }
    return undefined;
  })();

  // Basic ISO date sanity check
  const isISO = (s: unknown) =>
    typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

  const start_date = isISO(raw?.start_date) ? raw.start_date : null;
  const end_date = isISO(raw?.end_date) ? raw.end_date : null;

  const sql = typeof raw?.sql === "string" ? raw.sql : undefined;

  return { function: fn, chartType, start_date, end_date, sql };
}

async function askGeminiForPlan(prompt: string): Promise<Plan | null> {
  const system = `
You generate STRICT, SAFE JSON plans to fetch chart data from a municipal complaints database.
Return ONLY a JSON object, no prose, matching this TypeScript type exactly:

{
  "function": "complaints_by_category" | "complaints_by_ward" | "complaints_monthly" | "complaints_status",
  "start_date": string | null,   // YYYY-MM-DD or null
  "end_date": string | null,     // YYYY-MM-DD or null
  "chartType": "bar" | "line" | "pie" | "doughnut" | null,
  "sql": string                  // a human-readable SQL example for transparency only
}

Rules:
- Choose the function that best answers the prompt.
- If dates are not specified, set start_date and end_date to null.
- Prefer minimal, accurate outputs.
- The "sql" is JUST for display; the system will NOT execute it.
`.trim();

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${system}\n\nUser prompt:\n${prompt}\n\nReturn ONLY the JSON object.` }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
    },
  };

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    console.error("Gemini API error", resp.status, await resp.text());
    return null;
  }

  const data = await resp.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ?? "";

  const parsed = safeParsePlan(text);
  if (!parsed) return null;
  return clampPlan(parsed);
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, chartType: desiredChartType } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'prompt' string." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ask Gemini to plan a safe RPC call
    const plan = await askGeminiForPlan(prompt);
    if (!plan) {
      return new Response(JSON.stringify({ error: "Could not derive a plan from the prompt." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Execute the selected RPC safely
    console.log("Executing RPC:", plan.function, {
      start_date: plan.start_date,
      end_date: plan.end_date,
    });

    const { data, error } = await supabase.rpc(plan.function, {
      start_date: plan.start_date,
      end_date: plan.end_date,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows: { name: string; value: number }[] = Array.isArray(data) ? data : [];
    const suggestedChart = recommendChartType(plan.function, plan.chartType || desiredChartType);
    const title = FUNCTION_TITLES[plan.function] || "Chart";
    const totalRecords = rows.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

    const payload = {
      chartType: suggestedChart,
      title,
      totalRecords,
      data: rows,
      sql: plan.sql || undefined, // for transparency, not execution
      // dataPreview can be added in future by returning a limited table sample
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("generate-chart unexpected error:", e?.message || e);
    return new Response(JSON.stringify({ error: "Unexpected error generating chart." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
