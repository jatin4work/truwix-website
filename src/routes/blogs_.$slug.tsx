import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import Markdown from "react-markdown";
import { CalendarDays, Clock } from "lucide-react";
import { articles } from "@/components/site/editorial-data";
import { seo } from "@/components/site/Layout";
import { getPost } from "@/lib/site.functions";

import { publicationDate } from "@/lib/blog-policy";

export const Route = createFileRoute("/blogs_/$slug")({
  loader: async ({ params }) => {
    const article = articles.find((item) => item.slug === params.slug);
    if (article) return { kind: "static" as const, article };
    const post = await getPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { kind: "cms" as const, post };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.kind === "static" ? loaderData.article.title : loaderData?.post.title;
    const desc = loaderData?.kind === "static" ? loaderData.article.intro : loaderData?.post.excerpt;
    const head = seo(title ? `${title} | TRUWIX Journal` : "Article unavailable | TRUWIX", desc ?? "This TRUWIX article is unavailable.");
    const image = loaderData?.kind === "cms" ? loaderData.post.image_url : undefined;
    if (image?.startsWith("https://")) head.meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
    return head;
  },
  component: Page,
});
function Page() {
  const data = Route.useLoaderData();
  if (data.kind === "cms") {
    const p = data.post;
    return <article className="mx-auto max-w-3xl px-5 pb-16 pt-32"><Link to="/blogs" className="text-sm text-cyan">← All articles</Link><p className="mt-10 text-sm text-cyan">{p.category}</p><h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{p.title}</h1><ArticleMeta date={p.created_at} minutes={`${Math.max(2, Math.round(p.content.split(/\s+/).length / 220))} min read`} /><p className="mt-6 text-xl text-muted-foreground">{p.excerpt}</p>
      {p.image_url && <figure className="mt-10"><img src={p.image_url} alt={p.image_alt ?? p.title} className="aspect-video w-full rounded-lg object-cover" />{p.image_credit && <figcaption className="mt-2 text-xs text-muted-foreground">{p.image_credit}</figcaption>}</figure>}<div className="prose-truwix mt-12"><Markdown>{p.content}</Markdown></div></article>;
  }
  const article = data.article;
  return <article className="mx-auto max-w-4xl px-5 pb-16 pt-32"><Link to="/blogs" className="text-sm text-cyan">← All articles</Link><p className="mt-10 text-sm text-cyan">{article.category}</p><h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">{article.title}</h1><ArticleMeta date={article.publishedAt} minutes={article.minutes} /><p className="mt-6 text-xl text-muted-foreground">{article.intro}</p><img src={article.image} alt={article.category} width={1792} height={1024} className="mt-10 aspect-video w-full rounded-xl object-cover" /><div className="mx-auto mt-14 max-w-2xl space-y-10">{article.sections.map(([title, body]) => <section key={title}><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p></section>)}</div></article>;
}

function ArticleMeta({ date, minutes }: { date: string; minutes: string }) {
  return <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm"><span className="inline-flex items-center gap-2 font-medium text-foreground"><CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" /><time dateTime={date}>Published {publicationDate(date)}</time></span><span className="inline-flex items-center gap-2 text-muted-foreground"><Clock aria-hidden="true" className="h-4 w-4" />{minutes}</span></div>;
}
