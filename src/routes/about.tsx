import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Zap, ShieldCheck, Handshake, Repeat } from "lucide-react";
import { PageHero, seo } from "@/components/site/Layout";
import { BlueSection, Counter, Reveal, SectionHead } from "@/components/site/motion";
import { TeamSection } from "@/components/site/TeamSection";

export const Route = createFileRoute("/about")({
  head: () => seo("About TRUWIX Tech Solutions — If it's repetitive, automate it", "TRUWIX is the automation and IoT vertical helping businesses, startups and factories remove manual, repetitive work."),
  component: Page,
});

const values = [
  { icon: Repeat, t: "Automate the repeatable", d: "If a task happens twice, it should run itself the third time." },
  { icon: Handshake, t: "Build on what exists", d: "We extend your systems instead of forcing a rip-and-replace." },
  { icon: Zap, t: "Speed to value", d: "Live pilots in weeks, not year-long transformation programs." },
  { icon: ShieldCheck, t: "Reliable by design", d: "Monitored, logged and secure automations you can trust." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="About us" title={<>Why do manual work when you can <span className="text-primary">automate it?</span></>} sub="Automation, IoT and intelligence for businesses that want to move faster." />
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {[{ icon: Target, t: "Mission", d: "Free people from repetitive work to focus on customers and growth." }, { icon: Eye, t: "Vision", d: "One connected, self-reporting operation for every business." }].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.1}><div className="h-full rounded-2xl border border-border bg-card p-10"><x.icon className="h-7 w-7 text-primary" /><h2 className="mt-6 text-3xl font-semibold">{x.t}</h2><p className="mt-4 text-lg text-muted-foreground">{x.d}</p></div></Reveal>
          ))}
        </div>
      </section>
      <BlueSection>
        <div className="mx-auto max-w-7xl">
          <SectionHead eyebrow="What we believe" title="Our principles" accent="principles" />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => <Reveal key={v.t} delay={i * 0.12} y={32}><div className="h-full border-t border-border py-7"><v.icon className="h-8 w-8 text-primary" /><h3 className="mt-6 text-xl font-semibold">{v.t}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{v.d}</p></div></Reveal>)}
          </div>
        </div>
      </BlueSection>
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {([[50, "+", "clients"], [120, "+", "automations live"], [8, "", "industries"], [24, "/7", "monitoring"]] as const).map(([n, s, t]) => <div key={t} className="bg-card p-8"><div className="font-display text-5xl font-bold"><Counter to={n} suffix={s} /></div><div className="mt-2 text-muted-foreground">{t}</div></div>)}
        </div>
      </section>
      <TeamSection />
    </>
  );
}
