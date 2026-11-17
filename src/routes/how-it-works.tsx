import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { PageHero, PrimaryBtn, seo } from "@/components/site/Layout";
import { Reveal } from "@/components/site/motion";
import { steps } from "@/components/site/data";

export const Route = createFileRoute("/how-it-works")({
  head: () => seo("How it Works — 5 Steps to an Automated Operation | TRUWIX", "Discover, design, pilot, intelligence layer, scale — how TRUWIX automates your existing systems step by step."),
  component: Page,
});

function Page() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <>
      <PageHero eyebrow="How it works" title={<>From manual to <span className="text-primary">automated</span>, step by step</>} sub="Discover. Design. Pilot. Connect. Scale.">
        <PrimaryBtn>Start with a free audit</PrimaryBtn>
      </PageHero>
      <section className="px-5 pb-10">
        <div ref={ref} className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-border" />
          <motion.div style={{ height: h }} className="absolute left-6 top-0 w-px bg-primary" />
          <div className="space-y-10">
            {steps.map((s) => (
              <Reveal key={s.n}>
                <div className="relative pl-20">
                  <div className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-xl border border-primary bg-background font-display font-bold text-primary">{s.n}</div>
                  <div className="card-hover rounded-2xl border border-border bg-card p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl font-semibold md:text-3xl">{s.t}</h2><span className="rounded-full border border-cyan/40 px-3 py-1 text-xs font-semibold text-cyan">{s.time}</span></div>
                    <p className="mt-4 text-muted-foreground">{s.d}</p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-3">{s.out.map((o) => <div key={o} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-sm"><Check className="h-4 w-4 text-success" />{o}</div>)}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
