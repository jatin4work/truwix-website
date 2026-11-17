import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

/** Gemini provider with Google Search grounding through the Lovable AI Gateway. */
export function createSearchProvider(lovableApiKey: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": lovableApiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: (input, init) => {
      const body = JSON.parse(String(init?.body));
      body.tools = [...(body.tools ?? []), { type: "google_search" }];
      return runIdFetch.fetch(input, { ...init, body: JSON.stringify(body) });
    },
  });
}
