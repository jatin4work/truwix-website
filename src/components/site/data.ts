import { Workflow, LayoutDashboard, Factory, Cpu, Bot, Plug, Receipt, MessageCircle, CheckCheck, FileBarChart, Gauge, PackageSearch, Users, ShoppingBag, Truck, HeartPulse, Rocket, Building2 } from "lucide-react";

export const steps = [
  { n: "01", t: "Discover", time: "Week 1", d: "We study your existing systems, the technology you use and how work actually flows — every manual handoff, spreadsheet and bottleneck.", out: ["Process & systems map", "Automation opportunity report", "ROI estimate"] },
  { n: "02", t: "Design the automation layer", time: "Week 2–3", d: "We architect a customised automation layer that plugs into what you already have — no rip-and-replace.", out: ["Integration blueprint", "Workflow designs", "Data model"] },
  { n: "03", t: "Pilot & refine", time: "Week 3–6", d: "We run a focused pilot on real workflows, measure the impact and learn exactly which data and decisions matter to you.", out: ["Live pilot automations", "Measured time savings", "Dashboard requirements"] },
  { n: "04", t: "Intelligence layer", time: "Week 6–8", d: "We roll out your dashboard and intelligence layer — real-time visibility, alerts and insights across your operation.", out: ["Founder / ops dashboard", "Smart alerts", "AI-powered insights"] },
  { n: "05", t: "Scale & support", time: "Ongoing", d: "We extend automation across teams and sites, monitor everything and keep improving as you grow.", out: ["Ongoing optimisation", "New workflows", "24/7 monitoring"] },
];

export const integrations = ["SAP", "Tally", "Zoho", "Salesforce", "HubSpot", "Siemens PLC", "SCADA", "MQTT", "WhatsApp", "Google Sheets", "Power BI", "Slack", "OpenAI", "Odoo"];

export const solutions = [
  { icon: Workflow, t: "Workflow Automation", d: "Custom automated workflows that replace repetitive manual tasks across sales, finance, HR and operations.", pts: ["Approvals & routing", "Data entry elimination", "Scheduled jobs"], tag: "Business" },
  { icon: LayoutDashboard, t: "Founder & MIS Dashboards", d: "One live view of revenue, cash, production and people — pulled automatically from every system you run.", pts: ["Real-time KPIs", "Daily auto-reports", "Mobile access"], tag: "Intelligence" },
  { icon: Gauge, t: "Industrial IoT & Monitoring", d: "Connect machines, PLCs and sensors to track OEE, downtime, energy and quality in real time.", pts: ["Machine connectivity", "OEE & downtime", "Predictive alerts"], tag: "IoT" },
  { icon: Factory, t: "Dark Factory Solutions", d: "Lights-out manufacturing: end-to-end automated lines that run, report and self-correct with minimal human input.", pts: ["Line orchestration", "Auto quality checks", "Remote control"], tag: "IoT" },
  { icon: Bot, t: "AI Agents & Document AI", d: "AI agents that read invoices, answer customers, classify emails and take action inside your tools.", pts: ["Invoice & PO reading", "Support agents", "Smart classification"], tag: "AI" },
  { icon: Plug, t: "Integrations & APIs", d: "We connect ERP, CRM, MES, spreadsheets and legacy software so data flows without copy-paste.", pts: ["ERP / CRM sync", "Custom APIs", "Legacy bridges"], tag: "Business" },
];

export const samples = [
  { icon: Receipt, t: "Invoice → Tally auto-sync", cat: "Finance", d: "Invoices read from email, validated and posted to Tally automatically.", m: "18 hrs/week saved" },
  { icon: MessageCircle, t: "WhatsApp order bot", cat: "Sales", d: "Customers place and track orders on WhatsApp; orders land in your ERP.", m: "3× faster orders" },
  { icon: CheckCheck, t: "Multi-level approvals", cat: "Operations", d: "Purchase, leave and expense approvals routed and escalated automatically.", m: "2 days → 2 hrs" },
  { icon: FileBarChart, t: "Daily auto-reports", cat: "Intelligence", d: "Sales, production and cash reports delivered at 9 AM — no one compiles them.", m: "0 manual reports" },
  { icon: Gauge, t: "OEE machine dashboard", cat: "IoT", d: "Live machine status, downtime reasons and OEE for every line on the floor.", m: "+22% OEE" },
  { icon: PackageSearch, t: "Inventory & reorder alerts", cat: "Operations", d: "Stock levels tracked across warehouses with automatic reorder triggers.", m: "-35% stockouts" },
  { icon: Users, t: "Lead-to-CRM routing", cat: "Sales", d: "Leads from ads, website and calls enriched, scored and assigned instantly.", m: "<1 min response" },
  { icon: Cpu, t: "Predictive maintenance", cat: "IoT", d: "Vibration & temperature sensors flag failures before machines stop.", m: "-40% breakdowns" },
  { icon: LayoutDashboard, t: "Founder command centre", cat: "Intelligence", d: "Revenue, cash, pipeline and production in one screen, on your phone.", m: "1 source of truth" },
];

export const industries = [
  { icon: Factory, t: "Manufacturing", d: "Lines, machines, quality & dark factories" },
  { icon: ShoppingBag, t: "Retail & D2C", d: "Orders, inventory, customer ops" },
  { icon: Truck, t: "Logistics", d: "Dispatch, tracking, fleet visibility" },
  { icon: HeartPulse, t: "Healthcare", d: "Records, billing, scheduling" },
  { icon: Rocket, t: "Startups", d: "Founder dashboards, lean ops" },
  { icon: Building2, t: "Enterprises", d: "Cross-system integration at scale" },
];
