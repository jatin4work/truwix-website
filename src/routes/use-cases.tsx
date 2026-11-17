import { createFileRoute, redirect } from "@tanstack/react-router";
import { seo } from "@/components/site/Layout";
export const Route = createFileRoute("/use-cases")({ head: () => seo("Use Cases — Now with Solutions | TRUWIX", "TRUWIX use cases and automation solutions are now on one page."), beforeLoad: () => { throw redirect({ to: "/solutions", hash: "use-cases", statusCode: 301 }); } });
