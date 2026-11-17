import { createOpenAI } from "@ai-sdk/openai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export const CHAT_MODEL = "openai/gpt-6-astra";
export const responsesOptions = {
  openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
} as const;

export function createResponsesModel() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const openai = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return openai.responses(CHAT_MODEL);
}

export const TRUWIX_CONTEXT = `TRUWIX Tech Solutions (a vertical of Campaigning Source, Sahibabad, Ghaziabad, India) builds automation on top of a business's existing systems: end-to-end workflow automation, industrial IoT and machine connectivity (PLC/SCADA), dark-factory solutions, automation and founder dashboards, ERP/CRM/Tally/Excel integrations, AI agents and scheduled scripts that remove repetitive manual work. Process: understand the existing system -> custom automation layer -> pilot -> intelligence layer with dashboards and insights. Contact: info@truwix.com, +91 82874 04804.`;
