import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { trackVisit } from "@/lib/site.functions";
import { getVisitorId } from "./visitor";

export function VisitTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const track = useServerFn(trackVisit);
  const [notice, setNotice] = useState(false);
  useEffect(() => { setNotice(localStorage.getItem("truwix-notice") !== "1"); }, []);
  useEffect(() => { track({ data: { path, referrer: document.referrer, visitorId: getVisitorId() } }).catch(() => {}); }, [path, track]);
  if (!notice) return null;
  return <div role="note" className="fixed bottom-4 left-4 z-[65] flex max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground shadow-card">
    <p>We record basic visit details (IP address, pages viewed and device) to understand our traffic and respond to enquiries.</p>
    <button aria-label="Dismiss notice" onClick={() => { localStorage.setItem("truwix-notice", "1"); setNotice(false); }} className="text-foreground"><X className="h-4 w-4" /></button>
  </div>;
}
