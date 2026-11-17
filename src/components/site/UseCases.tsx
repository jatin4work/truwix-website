import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { samples } from "./data";
import { SectionHead } from "./motion";

export function UseCases() {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(samples.map((sample) => sample.cat))];
  return <section id="use-cases" className="scroll-mt-24 bg-section px-5 py-24">
    <div className="mx-auto max-w-7xl">
      <SectionHead eyebrow="Use cases" title="Find your next automation" accent="automation" sub="From everyday office tasks to connected factory floors." />
      <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter use cases">
        {categories.map((item) => <Button key={item} variant={category === item ? "default" : "outline"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
      </div>
      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><AnimatePresence mode="popLayout">
        {samples.filter((sample) => category === "All" || sample.cat === category).map((sample) => <motion.article layout key={sample.t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card-hover rounded-xl border border-border bg-card p-7">
          <div className="flex justify-between"><sample.icon className="h-6 w-6 text-primary" /><span className="text-xs text-muted-foreground">{sample.cat}</span></div><h3 className="mt-6 text-xl font-semibold">{sample.t}</h3><p className="mt-3 text-sm text-muted-foreground">{sample.d}</p><p className="mt-6 border-t border-border pt-4 text-cyan">{sample.m}</p>
        </motion.article>)}
      </AnimatePresence></motion.div>
    </div>
  </section>;
}