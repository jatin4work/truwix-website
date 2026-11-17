import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Database, Users, Cpu, Radio, Sheet, MessageCircle, Receipt, Boxes, Bot, BarChart3 } from "lucide-react";

const nodes = [
  { icon: Database, l: "ERP", x: 200, y: 120, sx: -260, sy: -140 },
  { icon: Users, l: "CRM", x: 600, y: 70, sx: 40, sy: -200 },
  { icon: Cpu, l: "PLC / SCADA", x: 1000, y: 120, sx: 260, sy: -160 },
  { icon: Radio, l: "IoT Sensors", x: 1080, y: 320, sx: 300, sy: 40 },
  { icon: Bot, l: "AI Agents", x: 1000, y: 520, sx: 220, sy: 200 },
  { icon: BarChart3, l: "Dashboards", x: 600, y: 570, sx: -20, sy: 220 },
  { icon: MessageCircle, l: "WhatsApp", x: 200, y: 520, sx: -240, sy: 200 },
  { icon: Sheet, l: "Sheets", x: 120, y: 320, sx: -300, sy: 20 },
  { icon: Receipt, l: "Tally", x: 380, y: 230, sx: -120, sy: -60 },
  { icon: Boxes, l: "SAP", x: 820, y: 410, sx: 140, sy: 80 },
];
const C = { x: 600, y: 320 };

function Node({ n, p }: { n: (typeof nodes)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [0, 0.45], [n.sx, 0]);
  const y = useTransform(p, [0, 0.45], [n.sy, 0]);
  const o = useTransform(p, [0, 0.2], [0.3, 1]);
  const lit = useTransform(p, [0.45, 0.55], [0, 1]);
  return (
    <motion.div style={{ left: `${(n.x / 1200) * 100}%`, top: `${(n.y / 640) * 100}%`, x, y, opacity: o }} className="absolute -translate-x-1/2 -translate-y-1/2">
      <div className="relative flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium md:text-sm">
        <motion.span style={{ opacity: lit }} className="absolute inset-0 rounded-xl border border-primary shadow-glow" />
        <n.icon className="relative h-4 w-4 text-primary" /><span className="relative hidden sm:inline">{n.l}</span>
      </div>
    </motion.div>
  );
}

export function NetworkScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(p, [0.3, 0.55], [0, 1]);
  const coreS = useTransform(p, [0.4, 0.55], [0.7, 1]);
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-6xl overflow-hidden" style={{ aspectRatio: "1200 / 640" }}>
      <svg viewBox="0 0 1200 640" className="absolute inset-0 h-full w-full" fill="none">
        {nodes.map((n, i) => (
          <g key={n.l}>
            <motion.path d={`M ${n.x} ${n.y} L ${C.x} ${C.y}`} className="stroke-primary/60" strokeWidth="1.3" style={{ pathLength: draw }} />
            <motion.circle r="3" className={i % 4 === 0 ? "fill-magenta" : "fill-cyan"} style={{ opacity: draw }}>
              <animateMotion dur={`${2 + (i % 3) * 0.6}s`} repeatCount="indefinite" path={`M ${n.x} ${n.y} L ${C.x} ${C.y}`} />
            </motion.circle>
          </g>
        ))}
        {nodes.map((n, i) => { const m = nodes[(i + 1) % nodes.length]!; return <motion.path key={"r" + i} d={`M ${n.x} ${n.y} L ${m.x} ${m.y}`} className="stroke-border" strokeDasharray="3 6" style={{ pathLength: draw }} />; })}
      </svg>
      {nodes.map((n) => <Node key={n.l} n={n} p={p} />)}
      <motion.div style={{ scale: coreS, left: "50%", top: "50%" }} className="absolute grid h-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-primary bg-primary px-6 text-primary-foreground shadow-glow" >
        <span className="absolute inset-0 animate-ring rounded-2xl border border-primary" />
        <div className="text-center"><div className="font-display text-sm font-bold tracking-[0.2em] md:text-xl">TRUWIX</div><div className="text-[10px] uppercase tracking-widest opacity-80 md:text-xs">Intelligence layer</div></div>
      </motion.div>
    </div>
  );
}
