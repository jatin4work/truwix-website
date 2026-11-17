import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, animate, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 18, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} initial={reduced ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }}>
      {children}
    </motion.div>
  );
}

const wordV: Variants = {
  hidden: { opacity: 0, y: "70%" },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.6, ease } }),
};

export function StaggerText({ text, className, accent }: { text: string; className?: string; accent?: string | undefined }) {
  const reduced = useReducedMotion();
  return (
    <motion.span className={className} initial={reduced ? false : "hidden"} animate={reduced ? "show" : false} whileInView="show" viewport={{ once: true }}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span custom={i} variants={wordV} className={`inline-block ${accent && accent.split(" ").includes(w) ? "text-primary" : ""}`}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.8, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, mv]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

export function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="flex w-max animate-marquee gap-12">
        {all.map((t, i) => (
          <span key={i} className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-muted-foreground/70">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ring rounded-full bg-cyan" /><span className="relative h-1.5 w-1.5 rounded-full bg-cyan" /></span>
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, accent, sub, center = true }: { eyebrow: string; title: string; accent?: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <h2 className="mt-7 text-4xl font-semibold leading-[1.15] md:text-[44px]"><StaggerText text={title} accent={accent} /></h2>
      {sub && <Reveal delay={0.15}><p className="mt-6 text-base leading-relaxed text-muted-foreground">{sub}</p></Reveal>}
    </div>
  );
}

export function BlueSection({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-65, 65]);
  const draw = useTransform(scrollYProgress, [0.05, 0.65], [0.08, 1]);
  return (
    <section ref={ref} id={id} className={`blue-section relative isolate overflow-hidden px-5 py-24 md:py-28 ${className}`}>
      <motion.svg aria-hidden="true" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" style={{ y: reduced ? 0 : y }} className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-none stroke-blue-band-line">
        {["M-80 180 H260 L420 340 H660", "M1480 120 H1120 L960 280 V520 H720", "M-40 700 H300 L460 540 V460", "M1480 720 H1180 L1020 560 H840"].map((d) => (
          <g key={d}>
            <path d={d} strokeWidth="1" />
            <motion.path d={d} strokeWidth="2" className="stroke-blue-band-foreground" style={{ pathLength: reduced ? 1 : draw }} opacity="0.3" />
          </g>
        ))}
        {[[420, 340], [960, 280], [460, 540], [1020, 560]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" className="fill-blue-band-foreground" stroke="none" opacity="0.35" />)}
      </motion.svg>
      <div className="relative">{children}</div>
    </section>
  );
}
