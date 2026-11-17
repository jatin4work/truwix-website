import team from "@/assets/truwix-team.jpg";
import { Reveal, SectionHead } from "./motion";

export function TeamSection() {
  return <section id="team" className="scroll-mt-24 px-5 py-24"><div className="mx-auto max-w-7xl"><SectionHead eyebrow="Our team" title="One team. Connected thinking." accent="Connected thinking." sub="Engineering. Automation. Intelligence." /><Reveal><figure className="mt-12"><img src={team} alt="Illustrative automation engineering team photograph" width={1792} height={1024} loading="lazy" className="aspect-[7/4] w-full rounded-xl object-cover" /><figcaption className="mt-3 text-xs text-muted-foreground">Illustrative team photograph · awaiting the official TRUWIX team photo</figcaption></figure></Reveal><div className="mt-8 flex flex-wrap justify-between gap-6 border-t border-border pt-8 text-sm text-cyan"><span>Workflow engineering</span><span>Industrial IoT</span><span>Data & dashboards</span><span>AI & integrations</span></div></div></section>;
}