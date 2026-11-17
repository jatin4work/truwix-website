import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, User, Mail, Phone, Workflow, MessageSquare } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { submitLead } from "@/lib/site.functions";
import { getVisitorId } from "./visitor";

const field = "mt-3 min-w-0 w-full rounded-lg border border-input bg-background px-3 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary";
const label = "min-w-0 text-sm font-medium text-muted-foreground";

export function ContactForm({ source = "contact" }: { source?: string }) {
  const send = useServerFn(submitLead);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending"); setError(undefined);
    try {
      await send({ data: { ...data, source, page: window.location.pathname, visitorId: getVisitorId() } });
      setState("sent"); form.reset();
    } catch (e) { setState("idle"); setError((e as Error).message || "Something went wrong. Please email info@truwix.com."); }
  }
  if (state === "sent") return <div role="status" className="flex flex-col items-start gap-3 py-8"><CheckCircle2 className="h-10 w-10 text-success" /><h3 className="text-2xl font-semibold">Thanks, we’ve received your enquiry.</h3><p className="text-muted-foreground">Our team will get back to you shortly. For anything urgent call +91 82874 04804.</p><Button variant="outline" onClick={() => setState("idle")}>Send another</Button></div>;
  return (
    <form onSubmit={submit} className="grid gap-x-5 gap-y-6 font-sans sm:grid-cols-2">
      <label className={label}><span className="flex items-center gap-2"><User aria-hidden="true" className="h-4 w-4 text-primary" />First name</span><input name="firstName" autoComplete="given-name" required className={field} /></label>
      <label className={label}><span className="flex items-center gap-2"><User aria-hidden="true" className="h-4 w-4 text-primary" />Last name</span><input name="lastName" autoComplete="family-name" required className={field} /></label>
      <label className={label}><span className="flex items-center gap-2"><Mail aria-hidden="true" className="h-4 w-4 text-primary" />Email</span><input name="email" autoComplete="email" required type="email" className={field} placeholder="you@company.com" /></label>
      <label className={label}><span className="flex items-center gap-2"><Phone aria-hidden="true" className="h-4 w-4 text-primary" />Phone</span><input name="phone" autoComplete="tel" type="tel" className={field} placeholder="+91" /></label>
      <label className={`${label} sm:col-span-2`}><span className="flex items-center gap-2"><Workflow aria-hidden="true" className="h-4 w-4 text-primary" />Interested in</span><select name="subject" className={field}><option>Automation enquiry</option><option>Founder dashboard</option><option>Industrial IoT</option><option>AI & integrations</option><option>Other</option></select></label>
      <label className={`${label} sm:col-span-2`}><span className="flex items-center gap-2"><MessageSquare aria-hidden="true" className="h-4 w-4 text-primary" />Your project</span><textarea name="message" required rows={3} className={field} placeholder="What would you like to automate?" /></label>
      <Button type="submit" size="lg" disabled={state === "sending"} className="h-12 sm:col-span-2">{state === "sending" ? "Sending…" : "Contact us"} <ArrowUpRight /></Button>
      {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
    </form>
  );
}
