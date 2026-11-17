import { motion } from "framer-motion";

const color = (tone: string) => tone === "violet" ? "stroke-violet" : tone === "cyan" ? "stroke-cyan" : "stroke-primary";
const fill = (tone: string) => tone === "violet" ? "fill-violet" : tone === "cyan" ? "fill-cyan" : "fill-primary";

export function BarChart({ data, tone = "primary", className = "h-24" }: { data: number[]; tone?: string; className?: string }) {
  return <div className={`flex items-end gap-1.5 ${className}`}>{data.map((b, j) => <motion.div key={j} initial={{ height: 0 }} whileInView={{ height: `${b}%` }} viewport={{ once: true }} transition={{ delay: j * 0.05, duration: 0.6 }} className={`flex-1 rounded-t ${tone === "violet" ? "bg-violet" : tone === "cyan" ? "bg-cyan" : "bg-primary"}`} />)}</div>;
}

function points(data: number[]) { return data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(" "); }

export function LineChart({ data, tone = "primary", area = false, className = "h-24" }: { data: number[]; tone?: string; area?: boolean; className?: string }) {
  const p = points(data);
  return <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`w-full overflow-visible ${className}`} initial={{ clipPath: "inset(0 100% 0 0)" }} whileInView={{ clipPath: "inset(0 0% 0 0)" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}>
    {[25, 50, 75].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-border" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />)}
    {area && <motion.polygon points={`0,100 ${p} 100,100`} className={fill(tone)} initial={{ opacity: 0 }} whileInView={{ opacity: 0.18 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />}
    <polyline points={p} fill="none" className={color(tone)} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
  </motion.svg>;
}

export function DonutChart({ data, labels, className = "h-24" }: { data: number[]; labels: string[]; className?: string }) {
  const tones = ["stroke-primary", "stroke-cyan", "stroke-violet", "stroke-success"];
  const dots = ["bg-primary", "bg-cyan", "bg-violet", "bg-success"];
  const total = data.reduce((a, b) => a + b, 0);
  let acc = 0;
  return <div className={`flex items-center gap-5 ${className}`}>
    <svg viewBox="0 0 42 42" className="h-full -rotate-90">
      <circle cx="21" cy="21" r="15.9" fill="none" className="stroke-border" strokeWidth="5" />
      {data.map((v, i) => { const pct = (v / total) * 100; const off = acc; acc += pct; return <motion.circle key={i} cx="21" cy="21" r="15.9" fill="none" className={tones[i % 4]} strokeWidth="5" pathLength={100} strokeDashoffset={-off} initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: `${pct - 1} ${101 - pct}` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.15 }} />; })}
    </svg>
    <ul className="space-y-1 text-[11px] text-muted-foreground">{labels.map((l, i) => <li key={l} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${dots[i % 4]}`} />{l} <span className="text-foreground">{Math.round((data[i]! / total) * 100)}%</span></li>)}</ul>
  </div>;
}
