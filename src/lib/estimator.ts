/** Fixed-formula project estimate. AI only writes the explanation around these numbers. */
export const CATEGORIES = {
  manufacturing: { label: "Manufacturing / factory", rate: 450, base: 350000, uplift: 18, error: 70 },
  oem: { label: "OEM / engineering", rate: 500, base: 400000, uplift: 15, error: 65 },
  startup: { label: "Startup / SaaS", rate: 700, base: 200000, uplift: 12, error: 60 },
  retail: { label: "Retail & e-commerce", rate: 400, base: 220000, uplift: 14, error: 60 },
  logistics: { label: "Logistics & supply chain", rate: 420, base: 300000, uplift: 16, error: 65 },
  healthcare: { label: "Healthcare & pharma", rate: 550, base: 320000, uplift: 10, error: 75 },
  services: { label: "Professional services", rate: 650, base: 180000, uplift: 11, error: 55 },
  other: { label: "Other", rate: 450, base: 250000, uplift: 10, error: 55 },
} as const;
export type Category = keyof typeof CATEGORIES;
export const SYSTEM_OPTIONS = ["Excel / Sheets", "Tally", "SAP", "Other ERP", "CRM", "WhatsApp / Email", "PLC / SCADA", "Paper registers"];

export type EstimateInput = { category: Category; teamSize: number; hoursPerWeek: number; systems: number };
export type Estimate = {
  costMin: number; costMax: number; weeksMin: number; weeksMax: number;
  hoursSavedMonth: number; yearlyValue: number; errorReduction: number; decisionLagCut: number; productivityUplift: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));
const round = (n: number, step: number) => Math.round(n / step) * step;

export function estimate(input: EstimateInput): Estimate {
  const c = CATEGORIES[input.category] ?? CATEGORIES.other;
  const team = clamp(input.teamSize, 1, 500);
  const hours = clamp(input.hoursPerWeek, 1, 400);
  const systems = clamp(input.systems, 1, 8);
  const hoursSavedMonth = Math.round(hours * 4.33 * 0.7);
  const cost = c.base + (systems - 1) * 60000 + Math.min(team, 100) * 2500;
  return {
    costMin: round(cost * 0.85, 10000),
    costMax: round(cost * 1.3, 10000),
    weeksMin: 3 + systems,
    weeksMax: 5 + systems * 2,
    hoursSavedMonth,
    yearlyValue: round(hoursSavedMonth * 12 * c.rate, 1000),
    errorReduction: c.error + Math.min(systems, 5) * 4,
    decisionLagCut: Math.min(95, 60 + systems * 5),
    productivityUplift: c.uplift + Math.min(Math.floor(team / 10), 10),
  };
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
