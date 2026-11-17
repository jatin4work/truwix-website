import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function requestMeta() {
  const req = getRequest();
  const h = req.headers;
  const ip = h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const cf = (req as unknown as { cf?: { country?: string; city?: string } }).cf;
  return { ip, country: h.get("cf-ipcountry") || cf?.country || null, city: cf?.city || null, user_agent: h.get("user-agent")?.slice(0, 400) || null };
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
  });
}

const s = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, unknown>) => {
    const email = s(d["email"], 200);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Please enter a valid email");
    return { first_name: s(d["firstName"], 100), last_name: s(d["lastName"], 100), email, phone: s(d["phone"], 40), subject: s(d["subject"], 120), message: s(d["message"], 4000), page: s(d["page"], 300), visitor_id: s(d["visitorId"], 80), source: s(d["source"], 40) || "contact" };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({ ...data, ...requestMeta() });
    if (error) { console.error(error); throw new Error("Could not send your enquiry. Please email info@truwix.com."); }
    return { ok: true };
  });

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((d: { path?: string; referrer?: string; visitorId?: string }) => ({ path: s(d.path, 300), referrer: s(d.referrer, 300), visitor_id: s(d.visitorId, 80) }))
  .handler(async ({ data }) => {
    if (data.path.startsWith("/admin")) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("visits").insert({ ...data, ...requestMeta() });
    return { ok: true };
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("posts").select("slug,title,excerpt,category,created_at,content,image_url,image_alt,image_credit").eq("published", true).order("created_at", { ascending: false }).limit(300);
  return (data ?? []).map(({ content, ...p }) => ({ ...p, minutes: Math.max(2, Math.round(content.split(/\s+/).length / 220)) }));
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: s(d.slug, 120) }))
  .handler(async ({ data }) => {
    const { data: post } = await publicClient().from("posts").select("slug,title,excerpt,category,content,created_at,image_url,image_alt,image_credit").eq("slug", data.slug).eq("published", true).maybeSingle();
    return post;
  });

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("services").select("id,title,description,tag").eq("published", true).order("sort_order");
  return data ?? [];
});
