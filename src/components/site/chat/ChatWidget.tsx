import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, Bot, History, MessageCircle, Plus, Square, X } from "lucide-react";
import { createThread, getThreadMessages, listThreads } from "@/lib/chat.functions";
import { getVisitorId } from "../visitor";

type Thread = { id: string; title: string; updated_at: string };
const ACTIVE_KEY = "truwix-chat-thread";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [showList, setShowList] = useState(false);
  const list = useServerFn(listThreads), create = useServerFn(createThread), load = useServerFn(getThreadMessages);

  const select = useCallback(async (id: string) => {
    setInitial(null); setActive(id); setShowList(false); localStorage.setItem(ACTIVE_KEY, id);
    setInitial((await load({ data: { visitorId: getVisitorId(), threadId: id } })) as UIMessage[]);
  }, [load]);
  const newChat = useCallback(async () => {
    const t = await create({ data: { visitorId: getVisitorId() } });
    setThreads((p) => [t, ...p]); setInitial([]); setActive(t.id); setShowList(false); localStorage.setItem(ACTIVE_KEY, t.id);
  }, [create]);

  useEffect(() => {
    if (!open || active) return;
    (async () => {
      const ts = await list({ data: { visitorId: getVisitorId() } });
      setThreads(ts);
      const saved = localStorage.getItem(ACTIVE_KEY);
      if (saved && ts.some((t) => t.id === saved)) await select(saved); else if (ts[0]) await select(ts[0].id); else await newChat();
    })().catch(() => {});
  }, [open, active, list, select, newChat]);

  return <>
    <AnimatePresence>{open && (
      <motion.div role="dialog" aria-label="Chat with TRUWIX" data-lenis-prevent initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 320, damping: 30 }} style={{ transformOrigin: "bottom right" }}
        className="fixed bottom-24 right-4 z-[70] flex h-[min(620px,calc(100dvh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background font-sans text-sm leading-relaxed shadow-card">
        <header className="flex items-center gap-3 border-b border-border bg-section px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">TRUWIX Solution Assistant</p><p className="text-xs text-muted-foreground">Tell us your business get a tailored automation plan</p></div>
          <button aria-label="Past chats" onClick={() => setShowList((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><History className="h-4 w-4" /></button>
          <button aria-label="New chat" onClick={() => void newChat()} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Plus className="h-4 w-4" /></button>
          <button aria-label="Close chat" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button>
        </header>
        {showList ? (
          <ul className="flex-1 overflow-y-auto p-2">{threads.map((t) => (
            <li key={t.id}><button onClick={() => void select(t.id)} className={`w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent ${t.id === active ? "bg-accent" : ""}`}><span className="line-clamp-1">{t.title}</span><span className="text-xs text-muted-foreground">{new Date(t.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></button></li>
          ))}</ul>
        ) : active && initial ? <Conversation key={active} threadId={active} initial={initial} /> : <div className="grid flex-1 place-items-center text-sm text-muted-foreground">Loading…</div>}
      </motion.div>
    )}</AnimatePresence>
    <motion.button onClick={() => setOpen((v) => !v)} aria-label={open ? "Close chat" : "Chat with us — find your solution"} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-4 z-[70] flex h-14 items-center gap-2 rounded-full bg-primary pl-4 pr-5 text-sm font-semibold text-primary-foreground shadow-glow">
      {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}<span className="hidden sm:inline">{open ? "Close" : "Chat with us · find your solution"}</span>
    </motion.button>
  </>;
}

function Conversation({ threadId, initial }: { threadId: string; initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({ id: threadId, messages: initial, transport: new DefaultChatTransport({ api: "/api/public/chat", body: () => ({ threadId, visitorId: getVisitorId() }) }) });
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [messages, status]);
  useEffect(() => { if (status === "ready") ta.current?.focus(); }, [status]);
  const busy = status === "submitted" || status === "streaming";
  const send = () => { const t = input.trim(); if (!t || busy) return; setInput(""); void sendMessage({ text: t }); };
  return <>
    <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 [overflow-wrap:anywhere]">
      {messages.length === 0 && <div className="rounded-xl border border-border bg-section p-4 text-sm"><p className="font-medium">Hi! 👋 I'm the TRUWIX assistant.</p><p className="mt-1 text-muted-foreground">What does your business do, and what's the most repetitive manual work in your day? I'll suggest how we can automate it.</p>
        <div className="mt-3 flex flex-wrap gap-2">{["We run a production line", "I'm an OEM", "We manage everything in Excel"].map((q) => <button key={q} onClick={() => void sendMessage({ text: q })} className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary">{q}</button>)}</div></div>}
      {messages.map((m) => { const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""); return m.role === "user"
        ? <div key={m.id} className="ml-auto max-w-[85%] break-words rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm leading-relaxed text-primary-foreground">{text}</div>
        : <div key={m.id} className="assistant-copy"><ReactMarkdown>{text}</ReactMarkdown></div>; })}
      {status === "submitted" && <div className="flex gap-1 py-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
      {error && <p className="text-sm text-destructive">{error.message.includes("{") ? "Something went wrong. Please try again." : error.message}</p>}
      <div ref={end} />
    </div>
    <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-3">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 focus-within:border-primary">
        <textarea ref={ta} autoFocus rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Describe your business or problem…" className="min-w-0 max-h-32 flex-1 resize-none bg-transparent px-1.5 py-1.5 font-sans text-sm outline-none" />
        {busy ? <button type="button" onClick={() => void stop()} aria-label="Stop" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary"><Square className="h-4 w-4" /></button>
          : <button aria-label="Send" disabled={!input.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"><ArrowUp className="h-4 w-4" /></button>}
      </div>
    </form>
  </>;
}
