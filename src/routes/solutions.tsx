import { createFileRoute } from "@tanstack/react-router";
import { BarChart, DonutChart, LineChart } from "@/components/site/Charts";
import { Check } from "lucide-react";
import { GhostBtn, PageHero, PrimaryBtn, seo } from "@/components/site/Layout";
import { BlueSection, Reveal } from "@/components/site/motion";
import { solutions } from "@/components/site/data";
import { UseCases } from "@/components/site/UseCases";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/site.functions";
import { SectionHead } from "@/components/site/motion";

const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: () => listServices() });

function AllServices() {
  const { data } = useSuspenseQuery(servicesQuery);
  if (!data.length) return null;
  return <section className="px-5 py-24"><div className="mx-auto max-w-7xl"><SectionHead eyebrow="All services" title="Everything we automate" accent="automate" />
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.map((s, i) => <Reveal key={s.id} delay={(i % 3) * 0.06}><div className="h-full rounded-xl border border-border bg-card p-6"><span className="text-xs font-semibold uppercase tracking-wider text-cyan">{s.tag}</span><h3 className="mt-3 text-xl font-semibold">{s.title}</h3><p className="mt-2 text-sm text-muted-foreground">{s.description}</p></div></Reveal>)}</div></div></section>;
}

export const Route = createFileRoute("/solutions")({
  head: () => seo("Solutions & Use Cases — Automation, Dashboards & IoT | TRUWIX", "Explore TRUWIX automation solutions and filter practical use cases for finance, sales, operations and industrial IoT."),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Page,
});

function Mini({ i }: { i: number }) {
  const s = solutions[i];
  if (!s) return null;
  const bars = [40, 62, 50, 75, 66, 88, 70];
  const tone = s.tag === "AI" ? "violet" : s.tag === "IoT" ? "cyan" : "primary";
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{s.t}</span><span className="flex items-center gap-1.5 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success animate-blink" />Live</span></div>
      <div className="mt-4 grid grid-cols-3 gap-2">{["Runs", "Saved", "Errors"].map((k, j) => <div key={k} className="rounded-lg border border-border bg-background/60 p-3"><div className="text-[10px] text-muted-foreground">{k}</div><div className="font-display text-lg font-semibold">{[`${1200 + i * 340}`, `${18 + i * 4}h`, "0"][j]}</div></div>)}</div>
      <div className="mt-4">{[
        <BarChart key="b" data={bars.map((b) => (b + i * 7) % 60 + 35)} tone={tone} />,
        <LineChart key="l" data={[30, 42, 38, 55, 52, 70, 82]} tone={tone} />,
        <DonutChart key="d" data={[45, 30, 15, 10]} labels={["Automated", "Assisted", "Review", "Manual"]} />,
        <LineChart key="a" area data={[20, 35, 30, 48, 60, 58, 78]} tone={tone} />,
      ][i % 4]}</div>
    </div>
  );
}

function Page() {
  return (
    <>
      <PageHero eyebrow="Solutions & use cases" title={<>Automation for every <span className="text-primary">layer</span> of your business</>} sub="Office to factory floor. Automation built on your existing systems.">
        <PrimaryBtn>Book a Consultation</PrimaryBtn><GhostBtn href="#use-cases">Explore use cases ↓</GhostBtn>
      </PageHero>
      <div>
        {solutions.map((s, i) => (
          <SolutionBand key={s.t} blue={i === 1 || i === 4}>
          <Reveal>
            <div className="mx-auto grid max-w-7xl items-center gap-16 py-8 lg:grid-cols-2">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <span className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-secondary"><s.icon className="h-6 w-6 text-primary" /></span>
                <h2 className="mt-6 text-3xl font-semibold md:text-4xl">{s.t}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{s.d}</p>
                <ul className="mt-8 space-y-4">{s.pts.map((p) => <li key={p} className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" />{p}</li>)}</ul>
              </div>
              <Mini i={i} />
            </div>
          </Reveal>
          </SolutionBand>
        ))}
      </div>
      <AllServices />
      <UseCases />
    </>
  );
}

function SolutionBand({ blue, children }: { blue: boolean; children: React.ReactNode }) {
  return blue ? <BlueSection>{children}</BlueSection> : <section className="px-5 py-16">{children}</section>;
}
