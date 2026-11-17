import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { CATEGORIES, estimate, inr, type Category } from "./estimator";

const s = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const runCalculator = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, unknown>) => {
    const email = s(d["email"], 200);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Please enter a valid email");
    const category = (s(d["category"], 30) in CATEGORIES ? s(d["category"], 30) : "other") as Category;
    const systems = Array.isArray(d["systems"]) ? (d["systems"] as unknown[]).map((x) => s(x, 40)).filter(Boolean).slice(0, 10) : [];
    return { name: s(d["name"], 100), email, category, problem: s(d["problem"], 2000), current: s(d["current"], 1000), goal: s(d["goal"], 2000), systems, teamSize: Number(d["teamSize"]) || 1, hoursPerWeek: Number(d["hoursPerWeek"]) || 1, visitorId: s(d["visitorId"], 80) };
  })
  .handler(async ({ data }) => {
    const result = estimate({ category: data.category, teamSize: data.teamSize, hoursPerWeek: data.hoursPerWeek, systems: Math.max(1, data.systems.length + (data.current ? 1 : 0)) });
    const h = getRequest().headers;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      first_name: data.name, email: data.email, source: "calculator", subject: `Calculator: ${CATEGORIES[data.category].label}`,
      message: `Problem: ${data.problem}\nCurrent: ${[...data.systems, data.current].filter(Boolean).join(", ")}\nGoal: ${data.goal}`,
      visitor_id: data.visitorId, page: "/", details: { input: data, estimate: result },
      ip: h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null, country: h.get("cf-ipcountry"), user_agent: h.get("user-agent")?.slice(0, 400) || null,
    });
    if (error) console.error(error);

    let explanation = "";
    try {
      const { streamText } = await import("ai");
      const { createResponsesModel, responsesOptions, TRUWIX_CONTEXT } = await import("./ai/responses.server");
      const r = streamText({
        model: createResponsesModel(), providerOptions: responsesOptions, maxRetries: 0,
        system: `${TRUWIX_CONTEXT}\nYou write a short, concrete automation recommendation (markdown, max 170 words): one line diagnosis, then 3-4 bullets of what TRUWIX would build (name real systems they use), then one line on the pilot. Do not invent new numbers; refer to the given estimate.`,
        prompt: `Industry: ${CATEGORIES[data.category].label}\nProblem: ${data.problem}\nSystems: ${[...data.systems, data.current].filter(Boolean).join(", ")}\nGoal: ${data.goal}\nTeam: ${data.teamSize}, manual hours/week: ${data.hoursPerWeek}\nEstimate: ${inr(result.costMin)}–${inr(result.costMax)}, ${result.weeksMin}-${result.weeksMax} weeks, ${result.hoursSavedMonth} h/month saved.`,
      });
      explanation = await r.text;
    } catch (e) { console.error("calculator AI", e); }
    return { estimate: result, explanation };
  });
