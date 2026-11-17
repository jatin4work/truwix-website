import { DonutChart, LineChart } from "@/components/site/Charts";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Clock, AlertTriangle, EyeOff, Plus } from "lucide-react";
import { GhostBtn, PrimaryBtn, seo } from "@/components/site/Layout";
import { BlueSection, Counter, Eyebrow, Marquee, Reveal, SectionHead, StaggerText } from "@/components/site/motion";
import { HeroScene } from "@/components/site/HeroScene";
import { NetworkScroll } from "@/components/site/NetworkScroll";
import { BlogSection, ProjectSection, ReviewsSection } from "@/components/site/Editorial";
import { industries, integrations, samples, solutions, steps } from "@/components/site/data";

import { CalculatorSection } from "@/components/site/Calculator";
import { postsQuery } from "@/lib/posts-query";
import { PeopleAtWork } from "@/components/site/PeopleAtWork";

export const Route = createFileRoute("/")({
  head: () => seo("TRUWIX Tech Solutions — Automation that connects your entire operation", "TRUWIX builds custom automation, founder dashboards, industrial IoT and dark factory solutions on top of your existing systems."),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <CalculatorSection />
      <Connect />
      <PeopleAtWork />
      <Solutions />
      <ManualVsAuto />
      <Process />
      <DashboardPreview />
      <Samples />
      <Industries />
      <Results />
      <ProjectSection />
      <ReviewsSection />
      <BlogSection />
      <FAQ />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-32 md:pt-36">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal><Eyebrow>Automation · IoT · Intelligence</Eyebrow></Reveal>
        <h1 className="mt-6 text-[44px] font-bold leading-[1.02] sm:text-6xl md:text-[68px]">
          <StaggerText text="Automate the work." /><br /><StaggerText text="Connect every system." accent="Connect every system." />
        </h1>
        <Reveal delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Connect your systems. Automate repetitive work. See everything live.</p></Reveal>
        <Reveal delay={0.4}><div className="mt-9 flex flex-wrap justify-center gap-3"><PrimaryBtn>Book a Consultation</PrimaryBtn><GhostBtn>Explore Solutions</GhostBtn></div></Reveal>
      </div>
      <div className="relative mt-14"><HeroScene /></div>
      <div className="relative mx-auto mt-16 max-w-7xl border-y border-border py-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Plugs into the systems you already run</p>
        <Marquee items={integrations} />
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    { icon: Clock, n: 40, s: "%", t: "of work hours", d: "Lost to copying, approvals and reports." },
    { icon: AlertTriangle, n: 27, s: "%", t: "error rate", d: "From disconnected data entry." },
    { icon: EyeOff, n: 3, s: " days", t: "decision lag", d: "Waiting for yesterday’s numbers." },
  ];
  return (
    <section className="bg-section px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="The problem" title="Manual work is quietly costing you" accent="costing you" sub="Less copying. Fewer errors. Faster decisions." />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <div className="card-hover h-full rounded-2xl border border-border bg-card p-8">
                <it.icon className="h-6 w-6 text-warning" />
                <div className="mt-6 font-display text-6xl font-bold tracking-tight"><Counter to={it.n} suffix={it.s} /></div>
                <div className="mt-1 font-semibold">{it.t}</div>
                <p className="mt-3 text-muted-foreground">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Connect() {
  return (
    <section className="px-5 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Connect everything" title="Scattered systems. One intelligence layer." accent="One intelligence layer." />
        <div className="mt-12"><NetworkScroll /></div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section className="bg-section px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Solutions" title="Everything that should run itself" accent="run itself" />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.08} className="min-w-0">
              <div className="card-hover group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-secondary"><s.icon className="h-5 w-5 text-primary" /></span>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${s.tag === "AI" ? "border-violet/50 text-violet" : "border-border text-muted-foreground"}`}>{s.tag}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold">{s.t}</h3>

                <ul className="mt-8 space-y-3">{s.pts.map((p) => <li key={p} className="flex items-center gap-3 text-sm text-muted-foreground"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />{p}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><GhostBtn to="/solutions">See all solutions →</GhostBtn></div>
      </div>
    </section>
  );
}

function ManualVsAuto() {
  const [auto, setAuto] = useState(true);
  const rows = [
    ["Order received on WhatsApp", "Typed into Excel by hand", "Synced to ERP instantly"],
    ["Invoice from supplier", "Checked & entered in Tally", "Read by AI, posted automatically"],
    ["Machine stops on line 3", "Noticed at shift end", "Alert on your phone in 10s"],
    ["Daily sales report", "2 hours of compiling", "Delivered at 9:00 AM"],
    ["Purchase approval", "Chased over calls for days", "Routed & escalated automatically"],
  ];
  return (
    <section className="px-5 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHead eyebrow="Before / after" title="A normal day, manual vs automated" accent="automated" />
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex w-fit rounded-[10px] border border-border bg-secondary p-1">
            {[false, true].map((v) => (
              <button key={String(v)} onClick={() => setAuto(v)} className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition ${auto === v ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {auto === v && <motion.span layoutId="mva" className={`absolute inset-0 rounded-lg ${v ? "bg-primary" : "bg-destructive/80"}`} />}
                <span className="relative">{v ? "Automated with TRUWIX" : "Manual today"}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map(([a, m, x], i) => (
            <div key={a} className="grid items-center gap-2 border-b border-border px-6 py-5 last:border-0 md:grid-cols-[1fr_1.2fr]">
              <div className="font-medium">{a}</div>
              <motion.div key={String(auto)} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                {auto ? <Check className="h-5 w-5 shrink-0 text-success" /> : <X className="h-5 w-5 shrink-0 text-destructive" />}
                <span className={auto ? "text-foreground" : "text-muted-foreground"}>{auto ? x : m}</span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const w = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <BlueSection>
      <div className="mx-auto max-w-7xl" ref={ref}>
        <SectionHead eyebrow="How it works" title="From manual to automated in 5 steps" accent="automated" />
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
          <motion.div style={{ width: w }} className="absolute left-0 top-6 hidden h-px bg-primary md:block" />
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative">
                  <div className="relative z-10 grid h-12 w-12 place-items-center rounded-xl border border-primary bg-background font-display font-bold text-primary">{s.n}</div>
                  <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan">{s.time}</div>
                  <h3 className="mt-2 text-xl font-semibold">{s.t}</h3>

                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-14 text-center"><GhostBtn to="/how-it-works">See the full process →</GhostBtn></div>
      </div>
    </BlueSection>
  );
}

function DashboardPreview() {
  const bars = [35, 52, 44, 68, 59, 77, 64, 85, 72, 90, 81, 94];
  return (
    <section className="px-5 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHead center={false} eyebrow="Intelligence layer" title="Your whole operation, live on one screen" accent="live" sub="Revenue, production and people. One live view." />
          <Reveal delay={0.2}><ul className="mt-8 space-y-3">{["Connected data", "Instant alerts", "AI insights"].map((t) => <li key={t} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20"><Check className="h-3 w-3 text-primary" /></span>{t}</li>)}</ul></Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div><div className="text-xs text-muted-foreground">Founder dashboard</div><div className="font-display text-lg font-semibold">Plant 01 · Today</div></div>
              <span className="flex items-center gap-2 rounded-full border border-success/40 px-3 py-1 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success animate-blink" />Connected</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[["Revenue", 48, "L", "text-foreground"], ["OEE", 87, "%", "text-cyan"], ["Orders", 312, "", "text-foreground"], ["Alerts", 3, "", "text-warning"]].map(([k, v, s, c]) => (
                <div key={k as string} className="rounded-xl border border-border bg-background/60 p-4"><div className="text-xs text-muted-foreground">{k}</div><div className={`mt-1 font-display text-2xl font-semibold ${c}`}><Counter to={v as number} suffix={s as string} prefix={k === "Revenue" ? "₹" : ""} /></div></div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Output per hour</span><span className="text-violet">AI forecast ▲ 6%</span></div>
                <LineChart area data={bars} className="mt-4 h-32" />
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="text-xs text-muted-foreground">Work by channel</div>
                <DonutChart data={[52, 28, 20]} labels={["ERP", "WhatsApp", "Sheets"]} className="mt-4 h-24" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Samples() {
  return (
    <section className="bg-section px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Automation samples" title="Real automations we build every week" accent="every week" />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {samples.slice(0, 3).map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.08}>
              <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                <div className="flex items-center justify-between"><s.icon className="h-6 w-6 text-primary" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.cat}</span></div>
                <h3 className="mt-6 text-xl font-semibold">{s.t}</h3>

                <div className="mt-6 border-t border-border pt-4 font-display font-semibold text-cyan">{s.m}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><GhostBtn to="/solutions">Browse all use cases →</GhostBtn></div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Industries" title="Built for factories, startups and everything between" accent="factories, startups" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.05}>
              <div className="card-hover flex items-center gap-5 rounded-2xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary"><it.icon className="h-6 w-6 text-primary" /></span>
                <div><div className="font-semibold">{it.t}</div><div className="text-sm text-muted-foreground">{it.d}</div></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Results() {
  const stats = [[120, "+", "workflows automated"], [35000, "+", "hours saved yearly"], [60, "%", "less downtime"], [98, "%", "client retention"]] as const;
  return (
    <BlueSection>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map(([n, s, t], i) => <Reveal key={t} delay={i * 0.1}><div className="border-t border-border pt-8"><div className="font-display text-5xl font-bold"><Counter to={n} suffix={s} /></div><div className="mt-3 text-muted-foreground">{t}</div></div></Reveal>)}
        </div>

      </div>
    </BlueSection>
  );
}

function FAQ() {
  const faqs = [
    ["Do we need to replace our existing software?", "No. TRUWIX builds on top of what you already run — ERP, Tally, spreadsheets, PLCs — and connects them."],
    ["How long does a first automation take?", "Most pilots go live in 3–6 weeks, starting with the workflow that wastes the most hours."],
    ["Can you connect old machines on the factory floor?", "Yes. We retrofit IoT gateways and sensors to legacy machines and PLCs to stream live data."],
    ["Is our data secure?", "Data stays in your cloud or on-premise servers, with role-based access and full audit logs."],
    ["What does it cost?", "It depends on scope. The audit is free and gives you an ROI estimate before you commit."],
  ];
  const [open, setOpen] = useState(-1);
  return (
    <section className="px-5 py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="FAQ" title="Questions, answered" accent="answered" />
        <div className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className={`rounded-xl border bg-card transition-colors ${open === i ? "border-primary" : "border-border"}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">{q}<Plus className={`h-5 w-5 shrink-0 transition ${open === i ? "rotate-45 text-primary" : ""}`} /></button>
              <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-muted-foreground">{a}</p></motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
