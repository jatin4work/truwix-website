import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Calculator as CalcIcon, Clock, Gauge, IndianRupee, Loader2, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { runCalculator } from "@/lib/calculator.functions";
import { CATEGORIES, SYSTEM_OPTIONS, inr, type Category, type Estimate } from "@/lib/estimator";
import { getVisitorId } from "./visitor";
import { PrimaryBtn } from "./Layout";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHead } from "./motion";

const field = "min-w-0 w-full resize-y rounded-lg border border-border bg-background px-3.5 py-2.5 font-sans text-sm text-foreground outline-none transition focus:border-primary";

export function CalculatorSection() {
  const run = useServerFn(runCalculator);
  const [f, setF] = useState({ category: "manufacturing" as Category, problem: "", current: "", goal: "", teamSize: 20, hoursPerWeek: 40, name: "", email: "" });
  const [systems, setSystems] = useState<string[]>(["Excel / Sheets"]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<{ estimate: Estimate; explanation: string } | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: k === "teamSize" || k === "hoursPerWeek" ? Number(e.target.value) : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { setRes(await run({ data: { ...f, systems, visitorId: getVisitorId() } })); }
    catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  return (
    <section id="calculator" className="px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Automation calculator" title="See what automation can save you" accent="save you" sub="Your workflow. Your systems. Your potential savings." />
        <div className="mt-14 grid items-stretch gap-6 font-sans lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="h-full min-w-0">
            <form onSubmit={submit} className="h-full space-y-7 rounded-2xl border border-border bg-card p-6 md:p-8">
              <div>
                <label className="text-sm font-medium">Business category</label>
                <div className="mt-2 flex flex-wrap gap-2">{(Object.keys(CATEGORIES) as Category[]).map((k) => (
                  <Button variant="outline" size="sm" type="button" key={k} onClick={() => setF({ ...f, category: k })} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${f.category === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>{CATEGORIES[k].label}</Button>
                ))}</div>
              </div>
              <div><label className="text-sm font-medium">Your challenge</label><textarea required rows={2} value={f.problem} onChange={set("problem")} className={`${field} mt-2`} placeholder="What slows your team down?" /></div>
              <div>
                <label className="text-sm font-medium">Current systems</label>
                <div className="mt-2 flex flex-wrap gap-2">{SYSTEM_OPTIONS.map((o) => { const on = systems.includes(o); return (
                  <Button variant="outline" size="sm" type="button" key={o} onClick={() => setSystems(on ? systems.filter((x) => x !== o) : [...systems, o])} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-cyan bg-cyan/15 text-foreground" : "border-border text-muted-foreground hover:border-cyan"}`}>{o}</Button>); })}</div>
                <input value={f.current} onChange={set("current")} className={`${field} mt-2`} placeholder="Anything else? (optional)" />
              </div>
              <div><label className="text-sm font-medium">Your automation goal</label><textarea required rows={2} value={f.goal} onChange={set("goal")} className={`${field} mt-2`} placeholder="What would you like to improve?" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium">Team size: <span className="text-primary">{f.teamSize}</span></label><input type="range" min={1} max={200} value={f.teamSize} onChange={set("teamSize")} className="mt-3 w-full accent-[var(--primary)]" /></div>
                <div><label className="text-sm font-medium">Manual hours / week: <span className="text-primary">{f.hoursPerWeek}</span></label><input type="range" min={1} max={300} value={f.hoursPerWeek} onChange={set("hoursPerWeek")} className="mt-3 w-full accent-[var(--primary)]" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={f.name} onChange={set("name")} className={field} placeholder="Your name" />
                <input required type="email" value={f.email} onChange={set("email")} className={field} placeholder="Work email" />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button disabled={busy} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:opacity-60">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Building your estimate…</> : <><CalcIcon className="h-4 w-4" />Calculate my automation</>}
              </Button>
              <p className="text-xs text-muted-foreground">Indicative estimate. We'll refine it on a free consultation.</p>
            </form>
          </Reveal>
          <Reveal delay={0.1} className="relative h-[600px] min-w-0 lg:h-full"><div className={`absolute inset-0 overflow-hidden rounded-2xl border ${res ? "border-primary/40 bg-card" : "border-2 border-dashed border-primary/40 bg-section"}`}><div data-lenis-prevent className="h-full w-full min-w-0 overflow-y-auto [overflow-wrap:anywhere]"><Result res={res} busy={busy} /></div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Result({ res, busy }: { res: { estimate: Estimate; explanation: string } | null; busy: boolean }) {
  if (!res) return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-card">
        <CalcIcon className={`h-7 w-7 text-primary ${busy ? "animate-pulse" : ""}`} />
        <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-section bg-cyan" />
        </span>
      </div>
      <div>
        <p className="text-xl font-semibold">{busy ? "Analysing your workflow…" : "Your estimate appears here"}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Cost, time saved and impact — tailored to your workflow.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["Cost range", "Timeline", "Hours saved", "Error reduction", "Decision lag", "Uplift"].map((h) => (
          <span key={h} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="font-bold text-primary">?</span>{h}
          </span>
        ))}
      </div>
    </div>
  );
  const e = res.estimate;
  const stats = [
    { i: IndianRupee, l: "Estimated cost", v: `${inr(e.costMin)} – ${inr(e.costMax)}` },
    { i: Clock, l: "Timeline", v: `${e.weeksMin}–${e.weeksMax} weeks` },
    { i: Zap, l: "Hours saved / month", v: `${e.hoursSavedMonth} h` },
    { i: IndianRupee, l: "Yearly value of time saved", v: inr(e.yearlyValue) },
    { i: ShieldCheck, l: "Error rate reduction", v: `up to ${e.errorReduction}%` },
    { i: Gauge, l: "Decision lag cut", v: `up to ${e.decisionLagCut}%` },
    { i: TrendingUp, l: "Production / sales uplift", v: `+${e.productivityUplift}%` },
  ];
  return (
    <div className="min-w-0 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Your automation estimate</p>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[repeat(2,minmax(0,1fr))]">{stats.map((s, idx) => (
        <div key={s.l} className={`min-w-0 rounded-xl border border-border bg-section p-4 ${idx === 0 ? "sm:col-span-2" : ""}`}>
          <s.i className="h-4 w-4 text-primary" /><div className="mt-2 text-xl font-bold tabular-nums">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div>
        </div>
      ))}</div>
      {res.explanation && <div className="assistant-copy mt-6"><ReactMarkdown>{res.explanation}</ReactMarkdown></div>}
      <div className="mt-6"><PrimaryBtn>Book a Consultation</PrimaryBtn></div>
    </div>
  );
}
