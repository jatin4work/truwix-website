import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Database, Users, Cpu, Radio, Sheet, MessageCircle, Receipt, Boxes, CheckCircle2, Activity } from "lucide-react";

// viewBox 1200 x 560. Nodes at left, core in centre, dashboards at right.
const inputs = [
  { icon: Database, l: "ERP", y: 60 }, { icon: Users, l: "CRM", y: 125 }, { icon: Cpu, l: "PLC", y: 190 },
  { icon: Radio, l: "Sensors", y: 255 }, { icon: Sheet, l: "Sheets", y: 320 }, { icon: MessageCircle, l: "WhatsApp", y: 385 },
  { icon: Receipt, l: "Tally", y: 450 }, { icon: Boxes, l: "SAP", y: 515 },
];
const CX = 600, CY = 290;
const outs = [110, 290, 470] as const;
const inPath = (y: number) => `M 150 ${y} C 360 ${y}, 380 ${CY}, ${CX - 70} ${CY}`;
const outPath = (y: number) => `M ${CX + 70} ${CY} C 820 ${CY}, 800 ${y}, 870 ${y}`;

function useTick(ms: number) { const [t, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT((x) => x + 1), ms); return () => clearInterval(i); }, [ms]); return t; }

export function HeroScene() {
  const t = useTick(1800);
  const uptime = (98.1 + ((t * 7) % 9) / 10).toFixed(1);
  const runs = 12480 + t * 3;
  const bars = [42, 58, 50, 72, 64, 80, 70].map((b, i) => Math.max(25, Math.min(95, b + (((t + i) * 13) % 17) - 8)));
  return (
    <div className="relative mx-auto w-full max-w-6xl" style={{ aspectRatio: "1200 / 560" }}>
      <svg viewBox="0 0 1200 560" className="absolute inset-0 h-full w-full" fill="none">
        {inputs.map((n, i) => (
          <g key={n.l}>
            <motion.path d={inPath(n.y)} className="stroke-border" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }} />
            <path id={`in${i}`} d={inPath(n.y)} className="animate-dash stroke-primary/50" strokeWidth="1.2" />
            <circle r="3.2" className={i % 3 === 0 ? "fill-magenta" : "fill-cyan"}>
              <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite"><mpath href={`#in${i}`} /></animateMotion>
            </circle>
          </g>
        ))}
        {outs.map((y, i) => (
          <g key={y}>
            <path id={`out${i}`} d={outPath(y)} className="stroke-primary/60" strokeWidth="1.5" />
            <circle r="3.6" className="fill-cyan"><animateMotion dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href={`#out${i}`} /></animateMotion></circle>
          </g>
        ))}
        {/* core */}
        <circle cx={CX} cy={CY} r="120" className="stroke-border" strokeDasharray="2 6" />
        <g className="animate-[spin_14s_linear_infinite]" style={{ transformOrigin: `${CX}px ${CY}px` }}><circle cx={CX} cy={CY} r="96" className="stroke-primary/50" strokeDasharray="40 260" strokeWidth="2" /></g>
        <g className="animate-[spin_22s_linear_infinite_reverse]" style={{ transformOrigin: `${CX}px ${CY}px` }}><circle cx={CX} cy={CY} r="120" className="stroke-violet/70" strokeDasharray="20 400" strokeWidth="2" /></g>
      </svg>

      {/* input tiles */}
      {inputs.map((n, i) => (
        <motion.div key={n.l} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
          className="absolute flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium sm:text-xs"
          style={{ left: "1%", top: `${(n.y / 560) * 100}%`, transform: "translateY(-50%)" }}>
          <n.icon className="h-3.5 w-3.5 text-primary" /><span className="hidden sm:inline">{n.l}</span>
          <span className={`h-1.5 w-1.5 rounded-full bg-success ${t % inputs.length === i ? "animate-blink" : ""}`} />
        </motion.div>
      ))}

      {/* core */}
      <div className="absolute grid place-items-center" style={{ left: `${(CX / 1200) * 100}%`, top: `${(CY / 560) * 100}%`, transform: "translate(-50%,-50%)", width: "11.5%", aspectRatio: "1" }}>
        <span className="absolute inset-0 animate-ring rounded-2xl border border-primary" />
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, duration: 0.7 }}
          className="relative grid h-full w-full place-items-center rounded-2xl border border-primary bg-primary text-primary-foreground shadow-glow">
          <div className="text-center"><div className="font-display text-[10px] font-bold tracking-[0.2em] sm:text-base">TRUWIX</div><div className="hidden text-[9px] uppercase tracking-widest opacity-80 sm:block">INTELLIGENCE</div></div>
        </motion.div>
      </div>

      {/* output dashboards */}
      <div className="absolute right-0 hidden w-[27%] -translate-y-1/2 sm:block" style={{ top: `${(outs[0] / 560) * 100}%` }}>
        <div className="glass rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-xs font-semibold">Workflow automated</span><span className="ml-auto text-[10px] text-success">LIVE</span></div>
          <div className="mt-1.5 font-display text-lg font-semibold tabular-nums">{runs.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">runs today</span></div>
        </div>
      </div>
      <div className="absolute right-0 hidden w-[27%] -translate-y-1/2 sm:block" style={{ top: `${(outs[1] / 560) * 100}%` }}>
        <div className="glass rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-cyan" /><span className="text-xs font-semibold">Machine uptime</span><span className="ml-auto font-display text-sm font-semibold tabular-nums">{uptime}%</span></div>
          <div className="mt-2 flex h-10 items-end gap-1">{bars.map((b, i) => <div key={i} style={{ height: `${b}%` }} className={`flex-1 transition-[height] duration-700 rounded-[3px] ${i === bars.length - 1 ? "bg-cyan" : "bg-primary/70"}`} />)}</div>
        </div>
      </div>
      <div className="absolute right-0 hidden w-[27%] -translate-y-1/2 sm:block" style={{ top: `${(outs[2] / 560) * 100}%` }}>
        <div className="glass rounded-xl p-3 shadow-card">
          <div className="text-xs font-semibold">Founder dashboard</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[["Revenue", "+32%"], ["Efficiency", "+48%"], ["Downtime", "-62%"]].map(([k, v]) => <div key={k} className="rounded-md bg-secondary py-1.5"><div className="text-[9px] text-muted-foreground">{k}</div><div className="font-display text-sm font-semibold text-success">{v}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
