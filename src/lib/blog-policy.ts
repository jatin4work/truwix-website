export const DAILY_BLOG_TARGET = 15;
export const BLOG_TOPICS = [
  "industrial IoT sensors and edge gateways", "workflow automation for SMEs", "predictive maintenance and machine monitoring",
  "AI agents for operations", "founder dashboards and MIS", "PLC connectivity and OPC UA",
  "digital twins in manufacturing", "order-to-invoice automation", "OEE and production analytics",
  "industrial cybersecurity", "robotics and dark factory readiness", "ERP and CRM integrations",
  "energy monitoring with IoT", "document processing automation", "real-time business intelligence",
];
export function dailyRemaining(done: number, target = DAILY_BLOG_TARGET) { return Math.max(0, Math.min(target, DAILY_BLOG_TARGET) - done); }
export function publicationDate(value: string) { return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }); }