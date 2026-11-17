import { motion, useReducedMotion } from "framer-motion";

export function LiveBackground() {
  const reduced = useReducedMotion();
  const paths = ["M30 -40 V200 Q30 240 70 240 H150 Q190 240 190 280 V1000", "M1370 -20 V320 Q1370 360 1330 360 H1250 Q1210 360 1210 400 V1000", "M-40 720 H100 Q140 720 140 680 V530", "M1440 620 H1310 Q1270 620 1270 660 V960"];
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35">
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none">
      {paths.map((path, index) => <g key={path}><path d={path} className="stroke-border" strokeWidth="1" /><motion.path d={path} className={index % 2 ? "stroke-cyan" : "stroke-primary"} strokeWidth="2" strokeDasharray="6 420" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: reduced ? 0 : -852 }} transition={{ duration: 16 + index * 4, repeat: Infinity, ease: "linear" }} /></g>)}
      {[[30,240],[190,280],[1370,360],[1210,400],[140,720],[1270,620]].map(([x,y], index) => <motion.rect key={index} x={x} y={y} width="6" height="6" rx="1" className="fill-cyan" animate={{ opacity: reduced ? 0.5 : [0.2,0.8,0.2] }} transition={{ duration: 4, delay: index * 0.6, repeat: Infinity }} />)}
    </svg>
  </div>;
}