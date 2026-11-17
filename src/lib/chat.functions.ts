import { createServerFn } from "@tanstack/react-start";

const s = (v: unknown, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const listThreads = createServerFn({ method: "POST" })
  .inputValidator((d: { visitorId: string }) => ({ visitorId: s(d.visitorId) }))
  .handler(async ({ data }) => {
    if (!data.visitorId) return [];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin.from("chat_threads").select("id,title,updated_at").eq("visitor_id", data.visitorId).order("updated_at", { ascending: false }).limit(30);
    return rows ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .inputValidator((d: { visitorId: string }) => ({ visitorId: s(d.visitorId) }))
  .handler(async ({ data }) => {
    if (!data.visitorId) throw new Error("Missing visitor");
    const { getRequest } = await import("@tanstack/react-start/server");
    const h = getRequest().headers;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("chat_threads").insert({ visitor_id: data.visitorId, ip: h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null, country: h.get("cf-ipcountry") }).select("id,title,updated_at").single();
    if (error) throw new Error("Could not start a chat");
    return row;
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .inputValidator((d: { visitorId: string; threadId: string }) => ({ visitorId: s(d.visitorId), threadId: s(d.threadId) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: t } = await supabaseAdmin.from("chat_threads").select("id").eq("id", data.threadId).eq("visitor_id", data.visitorId).maybeSingle();
    if (!t) return [];
    const { data: rows } = await supabaseAdmin.from("chat_messages").select("id,role,parts").eq("thread_id", data.threadId).order("created_at");
    return (rows ?? []).map((r) => ({ id: r.id, role: r.role as "user" | "assistant", parts: r.parts as unknown as { type: "text"; text: string }[] }));
  });
