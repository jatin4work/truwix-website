import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/journal-images/$filename")({
  server: { handlers: { GET: async ({ params }) => {
    if (!/^[a-f0-9-]{36}\.webp$/.test(params.filename)) return new Response("Not found", { status: 404 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post } = await supabaseAdmin.from("posts").select("id").eq("published", true).eq("image_url", `/api/public/journal-images/${params.filename}`).limit(1).maybeSingle();
    if (!post) return new Response("Not found", { status: 404 });
    const { data, error } = await supabaseAdmin.storage.from("journal-covers").download(params.filename);
    if (error || !data) return new Response("Not found", { status: 404 });
    return new Response(data, { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=86400" } });
  } } },
});