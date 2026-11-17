import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Globe, LayoutGrid, LogOut, Sparkles, Trash2, Users, Wrench } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { seo } from "@/components/site/Layout";
import { DAILY_BLOG_TARGET } from "@/lib/blog-policy";
import { generateBlogsNow } from "@/lib/admin.functions";
import { MessagesSquare } from "lucide-react";
import ReactMarkdownChat from "react-markdown";
import type { Database } from "@/integrations/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Visit = Database["public"]["Tables"]["visits"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [...seo("Content & Leads Console | TRUWIX", "Manage TRUWIX articles, automation publishing, services and enquiries.").meta, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

const input = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const fmt = (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setIsAdmin(undefined); return; }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);
  if (session === undefined) return <Center>Loading…</Center>;
  if (!session) return <Login />;
  if (isAdmin === undefined) return <Center>Checking access…</Center>;
  if (!isAdmin) return <Center><p>This account doesn’t have console access.</p><Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button></Center>;
  return <Console email={session.user.email ?? ""} />;
}

function Center({ children }: { children: ReactNode }) { return <div className="grid min-h-screen place-items-center px-5 text-center text-muted-foreground"><div>{children}</div></div>; }

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<string>();
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(undefined);
    const f = new FormData(e.currentTarget); const email = String(f.get("email")); const password = String(f.get("password"));
    const { data, error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "up" && !data.session) setMsg("Check your inbox to confirm your email, then sign in.");
  }
  return <div className="grid min-h-screen place-items-center px-5"><form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-8">
    <p className="text-xs font-semibold text-cyan">TRUWIX CONSOLE</p>
    <h1 className="text-2xl font-semibold">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
    <input name="email" type="email" required placeholder="admin@truwix.com" autoComplete="email" className={input} />
    <input name="password" type="password" required minLength={8} placeholder="Password" autoComplete={mode === "in" ? "current-password" : "new-password"} className={input} />
    <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
    {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
    <button type="button" className="text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}</button>
  </form></div>;
}

type Tab = "overview" | "leads" | "visitors" | "chats" | "blogs" | "services";
function Console({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const tabs: [Tab, string, typeof Users][] = [["overview", "Overview", LayoutGrid], ["leads", "Leads", Users], ["visitors", "Visitors", Globe], ["chats", "Chats", MessagesSquare], ["blogs", "Blogs", FileText], ["services", "Services", Wrench]];
  return <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
    <aside className="border-b border-border bg-section p-5 md:min-h-screen md:border-b-0 md:border-r">
      <Link to="/" className="font-display text-lg font-bold">TRUWIX <span className="text-cyan">Console</span></Link>
      <nav className="mt-6 flex gap-1 overflow-x-auto md:flex-col">{tabs.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}><I className="h-4 w-4" />{l}</button>)}</nav>
      <div className="mt-8 hidden text-xs text-muted-foreground md:block"><p className="truncate">{email}</p><button onClick={() => supabase.auth.signOut()} className="mt-2 inline-flex items-center gap-1 text-foreground"><LogOut className="h-3 w-3" />Sign out</button></div>
    </aside>
    <main data-lenis-prevent className="min-w-0 p-5 md:p-8">
      {tab === "overview" && <Overview />}{tab === "leads" && <Leads />}{tab === "visitors" && <Visitors />}{tab === "chats" && <Chats />}{tab === "blogs" && <Blogs />}{tab === "services" && <Services />}
    </main>
  </div>;
}

function useTable<T>(table: "leads" | "visits" | "posts" | "services", order = "created_at", limit = 500) {
  const [rows, setRows] = useState<T[]>([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); const { data } = await supabase.from(table).select("*").order(order, { ascending: order === "sort_order" }).limit(limit); setRows((data ?? []) as T[]); setLoading(false); }, [table, order, limit]);
  useEffect(() => { load(); }, [load]);
  return { rows, loading, load };
}

function H({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) { return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold">{title}</h1>{sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}</div>{children}</div>; }
function Table({ head, children }: { head: string[]; children: ReactNode }) { return <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-sm"><thead className="bg-section text-xs uppercase text-muted-foreground"><tr>{head.map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{children}</tbody></table></div>; }

function Overview() {
  const [stats, setStats] = useState<number[]>([]);
  useEffect(() => { (async () => {
    const day = new Date(Date.now() - 864e5).toISOString();
    const c = async (t: "leads" | "visits" | "posts", since?: string) => { let q = supabase.from(t).select("id", { count: "exact", head: true }); if (since) q = q.gte("created_at", since); return (await q).count ?? 0; };
    setStats(await Promise.all([c("leads"), c("leads", day), c("visits"), c("visits", day), c("posts")]));
  })(); }, []);
  const cards = ["Total leads", "Leads (24h)", "Total visits", "Visits (24h)", "Blog posts"];
  return <><H title="Overview" sub="Your website at a glance." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map((c, i) => <div key={c} className="rounded-xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">{c}</p><p className="mt-2 font-display text-3xl font-semibold">{stats[i] ?? "–"}</p></div>)}</div></>;
}

function csv(rows: Record<string, unknown>[], name: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]!);
  const body = [keys.join(","), ...rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" })); a.download = name; a.click();
}

function Leads() {
  const { rows, loading, load } = useTable<Lead>("leads");
  const [q, setQ] = useState("");
  const shown = useMemo(() => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);
  async function setStatus(id: string, status: string) { await supabase.from("leads").update({ status }).eq("id", id); load(); }
  async function del(id: string) { if (confirm("Delete this lead?")) { await supabase.from("leads").delete().eq("id", id); load(); } }
  return <><H title="Leads" sub="Everyone who submitted the contact form or pop-up."><div className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={`${input} w-48`} /><Button variant="outline" onClick={() => csv(shown, "truwix-leads.csv")}>Export CSV</Button></div></H>
    {loading ? <p className="text-muted-foreground">Loading…</p> : shown.length === 0 ? <p className="text-muted-foreground">No leads yet.</p> :
    <Table head={["Date", "Name", "Contact", "Subject / message", "Source", "IP / location", "Status", ""]}>{shown.map((l) => <tr key={l.id} className="align-top">
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{fmt(l.created_at)}</td>
      <td className="px-4 py-3 font-medium">{l.first_name} {l.last_name}</td>
      <td className="px-4 py-3"><a href={`mailto:${l.email}`} className="text-primary">{l.email}</a>{l.phone && <div><a href={`tel:${l.phone}`}>{l.phone}</a></div>}</td>
      <td className="max-w-xs px-4 py-3"><div className="font-medium">{l.subject}</div><div className="text-muted-foreground">{l.message}</div></td>
      <td className="px-4 py-3 text-muted-foreground">{l.source}<div className="text-xs">{l.page}</div></td>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{l.ip ?? "–"}<div className="text-xs">{[l.city, l.country].filter(Boolean).join(", ")}</div></td>
      <td className="px-4 py-3"><select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-xs">{["new", "contacted", "qualified", "won", "lost"].map((s) => <option key={s}>{s}</option>)}</select></td>
      <td className="px-4 py-3"><button aria-label="Delete lead" onClick={() => del(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
    </tr>)}</Table>}</>;
}

function Visitors() {
  const { rows, loading } = useTable<Visit>("visits", "created_at", 1000);
  const unique = new Set(rows.map((r) => r.visitor_id || r.ip)).size;
  return <><H title="Visitors" sub={`Latest ${rows.length} page views · ${unique} unique visitors`}><Button variant="outline" onClick={() => csv(rows, "truwix-visits.csv")}>Export CSV</Button></H>
    {loading ? <p className="text-muted-foreground">Loading…</p> : rows.length === 0 ? <p className="text-muted-foreground">No visits recorded yet.</p> :
    <Table head={["Time", "IP", "Location", "Page", "Referrer", "Device", "Visitor"]}>{rows.map((v) => <tr key={v.id}>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{fmt(v.created_at)}</td><td className="whitespace-nowrap px-4 py-3">{v.ip ?? "–"}</td><td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{[v.city, v.country].filter(Boolean).join(", ") || "–"}</td>
      <td className="px-4 py-3">{v.path}</td><td className="max-w-[12rem] truncate px-4 py-3 text-muted-foreground">{v.referrer || "Direct"}</td><td className="max-w-[14rem] truncate px-4 py-3 text-xs text-muted-foreground">{v.user_agent}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.visitor_id?.slice(0, 8)}</td>
    </tr>)}</Table>}</>;
}

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80); }

function Blogs() {
  const { rows, loading, load } = useTable<Post>("posts");
  const [edit, setEdit] = useState<Partial<Post> | null>(null);
  const [gen, setGen] = useState<string>();
  const [automation, setAutomation] = useState<{ paused: boolean; reason: string | null; last_success: string | null } | null>(null);
  useEffect(() => { const read = () => supabase.from("blog_automation").select("paused,reason,last_success").eq("id", "daily").maybeSingle().then(({ data }) => setAutomation(data)); read(); const timer = window.setInterval(read, 30000); return () => window.clearInterval(timer); }, []);
  const generate = useServerFn(generateBlogsNow);
  async function runGen() { setGen("Researching and writing a new article… this takes about a minute."); try { const r = await generate(); setGen(r.message); load(); } catch (e) { setGen((e as Error).message); } }
  async function save(e: FormEvent) {
    e.preventDefault(); if (!edit?.title) return;
    const row = { title: edit.title, slug: edit.slug || slugify(edit.title), excerpt: edit.excerpt ?? "", content: edit.content ?? "", category: edit.category || "Automation", published: edit.published ?? true, updated_at: new Date().toISOString() };
    const { error } = edit.id ? await supabase.from("posts").update(row).eq("id", edit.id) : await supabase.from("posts").insert(row);
    if (error) return alert(error.message);
    setEdit(null); load();
  }
  async function del(id: string) { if (confirm("Delete this post?")) { await supabase.from("posts").delete().eq("id", id); load(); } }
  async function toggle(p: Post) { await supabase.from("posts").update({ published: !p.published }).eq("id", p.id); load(); }
  if (edit) return <form onSubmit={save} className="max-w-3xl space-y-4"><H title={edit.id ? "Edit post" : "New post"} />
    <input required value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Title" className={input} />
    <div className="grid gap-4 sm:grid-cols-2"><input value={edit.slug ?? ""} onChange={(e) => setEdit({ ...edit, slug: slugify(e.target.value) })} placeholder="url-slug (auto)" className={input} /><input value={edit.category ?? ""} onChange={(e) => setEdit({ ...edit, category: e.target.value })} placeholder="Category" className={input} /></div>
    <textarea value={edit.excerpt ?? ""} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} placeholder="Short description (shown in search results)" rows={2} className={input} />
    <textarea value={edit.content ?? ""} onChange={(e) => setEdit({ ...edit, content: e.target.value })} placeholder="Article (Markdown: ## Heading, - bullet, **bold**)" rows={18} className={`${input} font-mono`} />
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.published ?? true} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} /> Published</label>
    <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div></form>;
  return <><H title="Blogs" sub={`Daily target: ${DAILY_BLOG_TARGET} researched automation and IoT articles.`}><div className="flex gap-2"><Button variant="outline" onClick={runGen}><Sparkles />Process next stage</Button><Button onClick={() => setEdit({ published: true })}>New post</Button></div></H>
    {automation && <p className="mb-4 text-sm text-muted-foreground">{automation.paused ? `Publishing paused: ${automation.reason}` : `Automatic publishing active · last publication: ${automation.last_success ? fmt(automation.last_success) : "Pending"}`}</p>}
    {gen && <p role="status" className="mb-4 rounded-lg border border-border bg-card p-3 text-sm">{gen}</p>}
    {loading ? <p className="text-muted-foreground">Loading…</p> : rows.length === 0 ? <p className="text-muted-foreground">No posts yet.</p> :
    <Table head={["Date", "Title", "Category", "Source", "Status", ""]}>{rows.map((p) => <tr key={p.id}>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{fmt(p.created_at)}</td>
      <td className="px-4 py-3"><button onClick={() => setEdit(p)} className="text-left font-medium hover:text-primary">{p.title}</button></td>
      <td className="px-4 py-3 text-muted-foreground">{p.category}</td><td className="px-4 py-3 text-muted-foreground">{p.source === "ai" ? "AI" : "Manual"}</td>
      <td className="px-4 py-3"><button onClick={() => toggle(p)} className={`rounded-full px-2 py-0.5 text-xs ${p.published ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>{p.published ? "Live" : "Draft"}</button></td>
      <td className="whitespace-nowrap px-4 py-3"><a href={`/blogs/${p.slug}`} target="_blank" rel="noreferrer" className="mr-3 text-xs text-primary">View</a><button aria-label="Delete post" onClick={() => del(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="inline h-4 w-4" /></button></td>
    </tr>)}</Table>}</>;
}

function Services() {
  const { rows, loading, load } = useTable<Service>("services", "sort_order");
  const [edit, setEdit] = useState<Partial<Service> | null>(null);
  async function save(e: FormEvent) {
    e.preventDefault(); if (!edit?.title) return;
    const row = { title: edit.title, description: edit.description ?? "", tag: edit.tag || "Automation", sort_order: edit.sort_order ?? rows.length + 1, published: edit.published ?? true };
    const { error } = edit.id ? await supabase.from("services").update(row).eq("id", edit.id) : await supabase.from("services").insert(row);
    if (error) return alert(error.message); setEdit(null); load();
  }
  async function del(id: string) { if (confirm("Delete this service?")) { await supabase.from("services").delete().eq("id", id); load(); } }
  if (edit) return <form onSubmit={save} className="max-w-2xl space-y-4"><H title={edit.id ? "Edit service" : "New service"} />
    <input required value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Service name" className={input} />
    <textarea value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Description" rows={4} className={input} />
    <div className="grid gap-4 sm:grid-cols-2"><select value={edit.tag ?? "Automation"} onChange={(e) => setEdit({ ...edit, tag: e.target.value })} className={input}>{["Automation", "Intelligence", "IoT", "AI"].map((t) => <option key={t}>{t}</option>)}</select><input type="number" value={edit.sort_order ?? ""} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} placeholder="Order" className={input} /></div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.published ?? true} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} /> Show on website</label>
    <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div></form>;
  return <><H title="Services" sub="Shown in the “All services” list on the Solutions page."><Button onClick={() => setEdit({ published: true })}>New service</Button></H>
    {loading ? <p className="text-muted-foreground">Loading…</p> : <div className="grid gap-4 md:grid-cols-2">{rows.map((s) => <div key={s.id} className="rounded-xl border border-border bg-card p-5"><div className="flex justify-between text-xs"><span className="text-cyan">{s.tag}</span><span className="text-muted-foreground">{s.published ? "Live" : "Hidden"}</span></div><h3 className="mt-2 text-lg font-semibold">{s.title}</h3><p className="mt-2 text-sm text-muted-foreground">{s.description}</p><div className="mt-4 flex gap-3 text-sm"><button onClick={() => setEdit(s)} className="text-primary">Edit</button><button onClick={() => del(s.id)} className="text-muted-foreground hover:text-destructive">Delete</button></div></div>)}</div>}</>;
}

type ChatThread = Database["public"]["Tables"]["chat_threads"]["Row"];
function Chats() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<{ id: string; role: string; parts: unknown; created_at: string }[]>([]);
  useEffect(() => { void supabase.from("chat_threads").select("*").order("updated_at", { ascending: false }).limit(300).then(({ data }) => setThreads(data ?? [])); }, []);
  useEffect(() => { if (!sel) return; void supabase.from("chat_messages").select("id,role,parts,created_at").eq("thread_id", sel).order("created_at").then(({ data }) => setMsgs(data ?? [])); }, [sel]);
  const text = (p: unknown) => (Array.isArray(p) ? p.map((x: { text?: string }) => x.text ?? "").join("") : "");
  return <div className="grid gap-4 md:grid-cols-[300px_1fr]">
    <ul className="max-h-[75vh] space-y-1 overflow-y-auto rounded-xl border border-border p-2">{threads.length === 0 && <li className="p-3 text-sm text-muted-foreground">No chats yet.</li>}{threads.map((t) => <li key={t.id}><button onClick={() => setSel(t.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent ${sel === t.id ? "bg-accent" : ""}`}><span className="line-clamp-1 font-medium">{t.title}</span><span className="block text-xs text-muted-foreground">{new Date(t.updated_at).toLocaleString("en-IN")} · {t.ip ?? "—"} {t.country ?? ""}</span><span className="block truncate text-xs text-muted-foreground">Visitor {t.visitor_id}</span></button></li>)}</ul>
    <div className="max-h-[75vh] space-y-3 overflow-y-auto rounded-xl border border-border p-4">{!sel ? <p className="text-sm text-muted-foreground">Select a chat to read it.</p> : msgs.map((m) => <div key={m.id} className={m.role === "user" ? "ml-auto max-w-[80%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground" : "prose-truwix max-w-none text-sm"}>{m.role === "user" ? text(m.parts) : <ReactMarkdownChat>{text(m.parts)}</ReactMarkdownChat>}</div>)}</div>
  </div>;
}
