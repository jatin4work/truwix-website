import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { ArrowRight, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { BlueSection, Reveal, Eyebrow } from "./motion";
import { useThemeMode } from "@/hooks/use-theme";
import type { ThemeMode } from "@/lib/theme";
import wordmarkAsset from "@/assets/truwix-wordmark.png.asset.json";
import lockupAsset from "@/assets/truwix-lockup.png.asset.json";
import { ContactPopup } from "./ContactPopup";
import { Button } from "@/components/ui/button";
import { LiveBackground } from "./LiveBackground";
import { VisitTracker } from "./VisitTracker";
import { ChatWidget } from "./chat/ChatWidget";

const nav = [
  { to: "/", label: "Home" },
  { to: "/solutions", label: "Solutions" },
  { to: "/projects", label: "Work & Insights" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ variant = "wordmark" }: { variant?: "wordmark" | "lockup" }) {
  const lockup = variant === "lockup";
  return (
    <Link to="/" aria-label="TRUWIX Tech Solutions — home" className="flex items-center">
      <img
        src={(lockup ? lockupAsset : wordmarkAsset).url}
        alt="TRUWIX"
        className={`logo-img ${lockup ? "h-11 w-auto" : "h-[26px] w-auto"}`}
        loading={lockup ? "lazy" : "eager"}
      />
    </Link>
  );
}

export type BtnTo = "/" | "/contact" | "/solutions" | "/how-it-works" | "/use-cases" | "/projects" | "/blogs" | "/about";
const btnBase = "inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-semibold transition";

export function PrimaryBtn({ to = "/contact", children }: { to?: BtnTo; children: ReactNode }) {
  return <Link to={to} className={`${btnBase} group bg-primary text-primary-foreground hover:shadow-glow`}>{children}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>;
}
export function GhostBtn({ to = "/solutions", href, children }: { to?: BtnTo; href?: string; children: ReactNode }) {
  const cls = `${btnBase} btn-ghost border border-foreground/55 bg-accent hover:border-primary`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <Link to={to} className={cls}>{children}</Link>;
}

export function ThemeToggle() {
  const { mode, choose } = useThemeMode();
  const next: ThemeMode = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
  const current = mode === "system" ? "follows your device" : `${mode} theme`;
  const nextLabel = next === "system" ? "follow your device" : `${next} theme`;
  const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Theme: ${current}. Switch to ${nextLabel}`}
      title={`Theme: ${current} — click for ${nextLabel}`}
      onClick={() => choose(next)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { const f = () => setScrolled(window.scrollY > 10); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className={`fixed left-0 top-0 z-50 w-full border-b transition-colors duration-500 ${scrolled ? "border-border bg-background/85 backdrop-blur-xl" : "border-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="relative rounded-lg px-3.5 py-2 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
              {({ isActive }) => (<>{isActive && <motion.span layoutId="nav-pill" className="absolute inset-x-3 -bottom-[13px] h-px bg-primary" />}{n.label}</>)}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2"><ThemeToggle />
        <Link to="/contact" className="hidden h-10 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:shadow-glow lg:inline-flex">Book a Consultation <ArrowRight className="h-4 w-4" /></Link>
        <Button variant="outline" size="icon" aria-label="Menu" onClick={() => setOpen(!open)} className="lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button></div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-border bg-background lg:hidden">
            <div className="p-4">
              {nav.map((n) => <Link key={n.to} to={n.to} className="block rounded-lg px-3 py-3 font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">{n.label}</Link>)}
              <Link to="/contact" className="mt-3 flex h-12 items-center justify-center gap-2 rounded-[10px] bg-primary px-3 text-center text-sm font-semibold text-primary-foreground">Book a Consultation <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function CTABand() {
  return (
    <BlueSection>
      <Reveal>
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-semibold md:text-6xl">If it's repetitive, automate it.</h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed opacity-85">Start with a free automation audit.</p>
            <Link to="/contact" className={`${btnBase} group mt-10 bg-primary px-7 text-primary-foreground hover:scale-[1.03] hover:shadow-glow`}>Book a Consultation <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </Reveal>
    </BlueSection>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy px-5 pb-10 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="lockup" />
          <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">Connected systems. Automated workflows. Live intelligence.</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success animate-blink" /> All systems operational</div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Company</h4>
          <ul className="mt-4 space-y-2.5">{nav.map((n) => <li key={n.to}><Link to={n.to} className="text-foreground/80 hover:text-primary">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Get in touch</h4>
          <ul className="mt-4 space-y-2.5 text-foreground/80"><li><a href="mailto:info@truwix.com">info@truwix.com</a></li><li><a href="tel:+918287404804">+91 82874 04804</a></li><li>Sahibabad, Ghaziabad · Serving globally</li></ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} TRUWIX Tech Solutions. All rights reserved.</span>
        <span>Automation · Intelligence · IoT</span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id = 0; const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); }; id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [path]);
  if (path.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <motion.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 mx-auto hidden max-w-7xl border-x border-border/40 lg:block" />
      <Navbar />
      <LiveBackground />
      <motion.main key={path} className="site-content relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>{children}</motion.main>
      <div className="relative z-10"><CTABand /><Footer /></div>
      <ContactPopup />
      <ChatWidget />
      <VisitTracker />
    </>
  );
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: ReactNode; sub: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-40">
      <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.08}><h1 className="mt-6 text-5xl font-bold leading-[1.02] md:text-[66px]">{title}</h1></Reveal>
        <Reveal delay={0.18}><p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">{sub}</p></Reveal>
        {children && <Reveal delay={0.26}><div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div></Reveal>}
      </div>
    </section>
  );
}

export function seo(title: string, description: string) {
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
}
