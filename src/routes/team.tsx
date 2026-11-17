import { createFileRoute, redirect } from "@tanstack/react-router";
import { seo } from "@/components/site/Layout";
export const Route = createFileRoute("/team")({ head: () => seo("Team — About TRUWIX Tech Solutions", "Meet the team on the TRUWIX About us page."), beforeLoad: () => { throw redirect({ to: "/about", hash: "team", statusCode: 301 }); } });
