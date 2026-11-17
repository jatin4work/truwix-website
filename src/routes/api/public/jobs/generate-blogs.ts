import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { GatewayError, runDailyGeneration } from "@/lib/blog-generator.server";
import { DAILY_BLOG_TARGET } from "@/lib/blog-policy";

const CF_MODULE = "cloudflare:workers";

export const Route = createFileRoute("/api/public/jobs/generate-blogs")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const body = (await request.json().catch(() => ({}))) as { count?: number };
        const count = Number.isFinite(body.count) ? Math.min(Math.max(Number(body.count), 1), DAILY_BLOG_TARGET) : DAILY_BLOG_TARGET;
        const job = runDailyGeneration(count).then(
          (r) => console.log("blog generation done", r),
          (e) => console.error("blog generation failed", e instanceof GatewayError ? e.status : "", e),
        );
        // The scheduler disconnects after a few seconds; keep the worker alive until the posts are written.
        try {
          const mod = (await import(/* @vite-ignore */ CF_MODULE)) as { waitUntil?: (p: Promise<unknown>) => void };
          if (mod.waitUntil) { mod.waitUntil(job); return Response.json({ accepted: true, count }, { status: 202 }); }
        } catch { /* not running on workerd (local dev) */ }
        await job;
        return Response.json({ success: true, count });
      },
    },
  },
});
