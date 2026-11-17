import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import lockupAsset from "@/assets/truwix-lockup.png.asset.json";
import { ContactForm } from "./ContactForm";
import { CONTACT_DELAY_MS, isAboveNavbar, isExitIntent } from "./contact-policy";

export function ContactPopup() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const exitShown = useRef(false);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), CONTACT_DELAY_MS);
    let previousY = 0;
    const showExit = () => {
      if (openRef.current || exitShown.current) return;
      exitShown.current = true;
      window.clearTimeout(timer);
      setOpen(true);
    };
    const leave = (event: MouseEvent) => {
      if (isExitIntent(event.clientY, event.relatedTarget)) showExit();
    };
    const move = (event: MouseEvent) => {
      if (isAboveNavbar(event.clientY, previousY)) showExit();
      previousY = event.clientY;
    };
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("mouseout", leave);
      document.addEventListener("mousemove", move);
    }
    return () => { window.clearTimeout(timer); document.removeEventListener("mouseout", leave); document.removeEventListener("mousemove", move); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);
  return <>
    <AnimatePresence>{open && <>
      <motion.div key="bg" className="fixed inset-0 z-[75] bg-background/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
      <div key="wrap" className="pointer-events-none fixed inset-0 z-[76] grid place-items-center p-4">
        <motion.div role="dialog" aria-modal="true" aria-labelledby="contact-popup-title" data-lenis-prevent
          initial={{ opacity: 0, scale: 0.05, x: "-45vw" }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.05, x: "-45vw" }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="pointer-events-auto relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background shadow-card">
          <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button>
      <div className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 border-b border-border bg-section p-8 md:border-b-0 md:border-r md:p-10">
          <img src={lockupAsset.url} alt="TRUWIX Tech Solutions" className="logo-img h-12 w-auto" />
          <h2 id="contact-popup-title" className="mt-10 text-3xl leading-tight">Let’s <span className="text-primary">automate.</span></h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Less repetitive work. More possibilities.</p>
          <ul className="mt-10 space-y-6 text-sm text-foreground [overflow-wrap:anywhere]">
            <li><a href="mailto:info@truwix.com" className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 shrink-0 text-primary" />info@truwix.com</a></li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><a href="tel:+918287404804" className="block hover:text-primary">+91 82874 04804</a><a href="tel:+919560973844" className="block hover:text-primary">+91 95609 73844</a></span></li>
            <li className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />49/26, Sahibabad Industrial Area Site 4, Sahibabad, Ghaziabad, Uttar Pradesh 201010</li>
          </ul>
        </div>
        <div className="min-w-0 p-8 pt-12 md:p-10 md:pt-12"><ContactForm source="popup" /></div>
      </div>
        </motion.div>
      </div>
    </>}</AnimatePresence>
    <motion.button onClick={() => setOpen(true)} aria-label="Inquire now" whileHover={{ x: 4 }} animate={{ opacity: open ? 0.55 : 1 }}
      className="fixed left-0 top-1/2 z-[70] flex -translate-y-1/2 items-center rounded-r-lg border border-l-0 border-border bg-white px-2.5 py-4 text-[#0A1220] shadow-card">
      <span className="text-xs font-bold uppercase tracking-[0.22em] [writing-mode:vertical-rl]">Inquire now</span>
    </motion.button>
  </>;
}
