import { createLovableAiGatewayRunIdFetch } from "./ai/run-id.server";
export class ImageGatewayError extends Error { constructor(public status: number, message: string) { super(message); } }
/** No browser previews are needed for this persisted, single-image job. */
export async function generateCover(title: string, excerpt: string): Promise<Uint8Array> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new ImageGatewayError(401, "AI is not configured");
  const run = createLovableAiGatewayRunIdFetch();
  const response = await run.fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai/gpt-image-2.5-sunburst", quality: "low", size: "1536x1024", output_format: "webp", prompt: `Create an original editorial photograph-style illustration for this article: ${title}. ${excerpt}. Show the specific technology or operational process clearly and realistically. Bright, crisp industrial or business setting, with natural neutral tones and small blue accents. No words, logos, gradients, collages or fake statistics. Distinct composition specific to this topic. This is an illustrative concept, not documentary evidence.` }),
  });
  const payload = await response.json() as { data?: { b64_json?: string }[]; error?: { message?: string }; message?: string };
  if (!response.ok) throw new ImageGatewayError(response.status, payload.error?.message ?? payload.message ?? `Image service returned ${response.status}`);
  const encoded = payload.data?.[0]?.b64_json;
  if (!encoded) throw new ImageGatewayError(422, payload.error?.message ?? "Image service returned no completed image");
  return Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
}