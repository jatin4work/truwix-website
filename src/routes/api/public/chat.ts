import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { extractChatContact } from "@/lib/chat-contact";

const Body = z.object({ threadId: z.string().uuid(), visitorId: z.string().min(4).max(80), messages: z.array(z.any()).min(1).max(80) });

const SYSTEM = (ctx: string) => `${ctx}

You are TRUWIX's solution consultant chatting with a website visitor. Goal: understand their business and pitch a fitting TRUWIX automation solution.
- Ask one or two short questions at a time: industry and what they make/do, team size, current process and systems (Excel, Tally, SAP, PLCs, WhatsApp...), the biggest manual pain.
- Whatever the business (production line, OEM, factory, retail, services, startup), always steer toward automation: workflow automation, IoT/machine data, dashboards, dark-factory steps, AI agents.
- After 2-3 exchanges, propose a concrete solution: what we connect, what gets automated, the dashboard they get, a pilot plan, expected impact (hours saved, fewer errors, faster decisions) as ranges.
- Then invite them to share name + email/phone or book a consultation at /contact. When they share their name or contact details, thank them briefly instead of repeating the proposal. Never claim an email has been sent. Keep replies under 150 words, friendly, markdown allowed. Never claim things TRUWIX did not say; never quote fixed prices.`;

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        const { threadId, visitorId } = parsed.data;
        const messages = parsed.data.messages as UIMessage[];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: thread } = await supabaseAdmin.from("chat_threads").select("id,title").eq("id", threadId).eq("visitor_id", visitorId).maybeSingle();
        if (!thread) return Response.json({ error: "Chat not found" }, { status: 404 });

        const since = new Date(Date.now() - 3600_000).toISOString();
        const { data: mine } = await supabaseAdmin.from("chat_threads").select("id").eq("visitor_id", visitorId);
        const { count } = await supabaseAdmin.from("chat_messages").select("id", { count: "exact", head: true }).eq("role", "user").gte("created_at", since).in("thread_id", (mine ?? []).map((t) => t.id));
        if ((count ?? 0) >= 40) return Response.json({ error: "You've sent a lot of messages — please try again in a little while, or email info@truwix.com." }, { status: 429 });

        const last = messages[messages.length - 1];
        const lastText = (last?.parts ?? []).map((p) => (p.type === "text" ? p.text : "")).join(" ").slice(0, 4000);
        const { data: previous } = await supabaseAdmin.from("chat_messages").select("parts").eq("thread_id", threadId).eq("role", "assistant").order("created_at", { ascending: false }).limit(1).maybeSingle();
        const previousParts = previous?.parts as unknown as { type: string; text?: string }[] | undefined;
        const contact = extractChatContact(lastText, previousParts?.map((p) => p.type === "text" ? p.text ?? "" : "").join(" ") ?? "");
        if (last?.role === "user") {
          const { error: saveError } = await supabaseAdmin.from("chat_messages").insert({ thread_id: threadId, role: "user", parts: [{ type: "text", text: lastText }] });
          if (saveError) return Response.json({ error: "Could not save your message. Please try again." }, { status: 500 });
          const upd: { updated_at: string; title?: string } = { updated_at: new Date().toISOString() };
          if (thread.title === "New chat") upd.title = lastText.slice(0, 60);
          await supabaseAdmin.from("chat_threads").update(upd).eq("id", threadId);
          if (contact.hasContact) {
            const { error: leadError } = await supabaseAdmin.from("leads").insert((contact.emails.length ? contact.emails : [""]).map((email) => ({ first_name: contact.name ?? "", email, phone: contact.phone ?? "", source: "chat", subject: "AI chat", message: lastText, visitor_id: visitorId, page: "chat", details: { thread_id: threadId } })));
            if (leadError) return Response.json({ error: "Could not save your contact details. Please try again." }, { status: 500 });
            const text = contact.emails.length || contact.phone
              ? "Thank you for contacting TRUWIX! Our team will contact you soon."
              : "Thank you for sharing your name! Please share your email or phone number so our team can contact you soon.";
            const { error: replyError } = await supabaseAdmin.from("chat_messages").insert({ thread_id: threadId, role: "assistant", parts: [{ type: "text", text }] });
            if (replyError) return Response.json({ error: "Could not save the reply. Please try again." }, { status: 500 });
            return createUIMessageStreamResponse({ stream: createUIMessageStream({
              originalMessages: messages,
              execute: ({ writer }) => {
                writer.write({ type: "text-start", id: "thanks" });
                writer.write({ type: "text-delta", id: "thanks", delta: text });
                writer.write({ type: "text-end", id: "thanks" });
              },
            }) });
          }
        }

        const { createResponsesModel, responsesOptions, TRUWIX_CONTEXT } = await import("@/lib/ai/responses.server");
        const result = streamText({
          model: createResponsesModel(), providerOptions: responsesOptions, maxRetries: 0, abortSignal: request.signal,
          system: SYSTEM(TRUWIX_CONTEXT), messages: await convertToModelMessages(messages.slice(-30)),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ responseMessage }) => {
            const text = responseMessage.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            if (!text) return;
            const { error } = await supabaseAdmin.from("chat_messages").insert({ thread_id: threadId, role: "assistant", parts: [{ type: "text", text }] });
            if (error) console.error("chat persist", error);
          },
          onError: (e) => { console.error("chat", e); const st = (e as { statusCode?: number })?.statusCode; return st === 402 ? "Our assistant is temporarily unavailable. Please email info@truwix.com." : st === 429 ? "Busy right now — please try again in a minute." : "Something went wrong. Please try again."; },
        });
      },
    },
  },
});
