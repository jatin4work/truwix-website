import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero, seo } from "@/components/site/Layout";
import { BlogSection } from "@/components/site/Editorial";
import { Reveal, SectionHead } from "@/components/site/motion";
import { postsQuery } from "@/lib/posts-query";

export const Route = createFileRoute("/blogs")({
  head: () => seo("Automation & Industry 4.0 Journal | TRUWIX Tech Solutions", "Daily articles on workflow automation, Industry 4.0, industrial IoT and founder dashboards from TRUWIX."),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Page,
});
function Page() {
  return <><PageHero eyebrow="Journal" title={<>The <span className="text-primary">TRUWIX</span> journal</>} sub="A practical perspective on connecting systems, Industry 4.0 and removing repetitive work." />
    <BlogSection full /></>;
}
