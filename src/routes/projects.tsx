import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seo } from "@/components/site/Layout";
import { ProjectSection, BlogSection } from "@/components/site/Editorial";
import { postsQuery } from "@/lib/posts-query";
export const Route = createFileRoute("/projects")({ head: () => seo("Automation Project Concepts | TRUWIX Tech Solutions", "Explore illustrative connected-factory, founder-dashboard and order-automation projects."), loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery), component: Page });
function Page() { return <><PageHero eyebrow="Work & insights" title={<>From disconnected to <span className="text-primary">connected.</span></>} sub="Explore project concepts and practical automation insights for businesses, startups and factories." /><ProjectSection full /><BlogSection full /></>; }