import workshop from "@/assets/engineers-workshop.jpg.asset.json";
import collaboration from "@/assets/team-collaboration.jpg.asset.json";
import { Reveal, SectionHead } from "./motion";

export function PeopleAtWork() {
  return (
    <section className="bg-section px-5" aria-label="People and automation">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHead eyebrow="People first" title="Built around the people doing the work" accent="people" sub="From the workshop to the meeting room. Better systems start with understanding your team." />
        <div className="mt-16 grid items-start gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Reveal>
            <figure>
              <img src={workshop.url} alt="Engineers discussing machinery together in a workshop" width={1600} height={1067} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
              <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span>On the factory floor</span><a href="https://www.pexels.com/photo/engineers-in-workshop-3862618/" target="_blank" rel="noreferrer" className="text-xs underline">Stock photo · ThisIsEngineering / Pexels</a></figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.12} className="md:pt-16">
            <figure>
              <img src={collaboration.url} alt="Colleagues collaborating around a table at work" width={1400} height={933} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
              <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span>Across your teams</span><a href="https://www.pexels.com/photo/people-shaking-hands-3184291/" target="_blank" rel="noreferrer" className="text-xs underline">Stock photo · fauxels / Pexels</a></figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}