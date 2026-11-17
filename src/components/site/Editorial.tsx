import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Quote, Star } from "lucide-react";
import { GhostBtn } from "@/components/site/Layout";
import { articles, projects } from "./editorial-data";
import { Reveal, SectionHead } from "./motion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/posts-query";
import { publicationDate } from "@/lib/blog-policy";

export function ProjectSection({ full = false }: { full?: boolean }) {
  return <section className="px-5 py-24"><div className="mx-auto max-w-7xl">
    <SectionHead eyebrow="Project concepts" title="Connected systems. Tangible possibilities." accent="Tangible possibilities." sub="Illustrative automation projects — shaped around the systems you already use." />
    <div className="mt-14 grid gap-8 md:grid-cols-3">{projects.map((project, i) => <Reveal key={project.slug} delay={i * 0.08}><article className="group h-full overflow-hidden rounded-xl border border-border bg-card">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="block"><img src={project.image} alt={project.title} width={1792} height={1024} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><div className="p-6"><p className="text-xs text-cyan">{project.category}</p><h3 className="mt-3 flex items-start justify-between gap-3 text-2xl font-semibold">{project.title}<ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary" /></h3><p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">{project.systems}</p></div></Link>
    </article></Reveal>)}</div>
    {!full && <div className="mt-10 text-center"><GhostBtn to="/projects">Explore projects <ArrowUpRight /></GhostBtn></div>}
  </div></section>;
}

export function BlogSection({ full = false }: { full?: boolean }) {
  const { data: posts } = useSuspenseQuery(postsQuery);
  const entries = posts.length ? (full ? posts : posts.slice(0, 3)).map((p) => ({ ...p, image: p.image_url ?? "", intro: p.excerpt, minutes: `${p.minutes} min read`, publishedAt: p.created_at })) : articles;
  return <section className="bg-section px-5 py-24"><div className="mx-auto max-w-7xl"><SectionHead eyebrow="The TRUWIX journal" title="Ideas for a less manual business" accent="less manual" />
    <div className="mt-14 grid gap-8 md:grid-cols-3">{entries.map((article, i) => <Reveal key={article.slug} delay={(i % 3) * 0.08}><article className="h-full border-b border-border pb-6"><Link to="/blogs/$slug" params={{ slug: article.slug }}>{article.image && <img src={article.image} alt={article.category} width={1792} height={1024} loading="lazy" className="aspect-video w-full rounded-lg object-cover" />}<div className="mt-5 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span className="text-cyan">{article.category}</span><span>{article.minutes}</span></div><div className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" /><time dateTime={article.publishedAt}>Published {publicationDate(article.publishedAt)}</time></div><h3 className="mt-3 text-2xl font-semibold transition hover:text-primary">{article.title}</h3><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read full article <ArrowUpRight className="h-4 w-4" /></span></Link></article></Reveal>)}</div>
    {!full && <div className="mt-10 text-center"><GhostBtn to="/blogs">All articles <ArrowUpRight /></GhostBtn></div>}
  </div></section>;
}

export function ReviewsSection() {
  const reviews = [
    { quote: "TRUWIX connected our machines and Tally into one dashboard. I see the whole plant on my phone now.", role: "Manufacturing owner" },
    { quote: "Our order processing went from copying data across tools to one connected workflow.", role: "D2C operations lead" },
    { quote: "Daily reporting no longer starts with a spreadsheet chase. The team can focus on the decisions.", role: "Startup founder" },
  ];
  return <section className="px-5 py-24"><div className="mx-auto max-w-7xl"><SectionHead eyebrow="Testimonials & reviews" title="Less busywork. More room to grow." accent="More room to grow." sub="Sample testimonials — pending verified client feedback." />
    <div className="mt-14 grid gap-5 md:grid-cols-3">{reviews.map((review, i) => <Reveal key={review.role} delay={i * 0.08}><figure className="flex h-full flex-col rounded-xl border border-border bg-card p-7"><div className="flex items-center justify-between"><Quote className="h-6 w-6 text-primary" /><span className="text-xs text-muted-foreground">Sample review</span></div><div aria-label="Illustrative five-star rating" className="mt-6 flex gap-1 text-warning">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div><blockquote className="mb-8 mt-5 text-lg leading-relaxed">“{review.quote}”</blockquote><figcaption className="mt-auto border-t border-border pt-5 text-sm text-muted-foreground">{review.role}</figcaption></figure></Reveal>)}</div>
  </div></section>;
}