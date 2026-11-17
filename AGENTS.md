<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Site shell (navbar, CTA band, footer, Lenis smooth scroll) lives in src/components/site/Layout.tsx and wraps the Outlet in __root — one shared layout for all pages.
- Animation primitives (Reveal, StaggerText, Counter, Marquee) live in src/components/site/motion.tsx — reuse them for consistent motion.
- Public content sections use `.site-content` screen-height minimums and shared spacing, never fixed heights or scroll snapping, so long content grows without clipping; PeopleAtWork holds attributed workplace photos distinct from the official team image.
- Site content lists (solutions, samples, steps, industries, integrations) live in src/components/site/data.ts; hero and scroll network animations are SVG + framer-motion in HeroScene.tsx / NetworkScroll.tsx — no gradients anywhere (brand rule).
- ContactPopup is mounted once in SiteShell and shares ContactForm with the contact page; email drafts avoid pretending an enquiry was delivered without a connected service.
- Solutions and use cases share /solutions; /use-cases redirects there so existing links keep working.
- Editorial lists live in editorial-data.ts; detail routes use trailing-underscore filenames to render independently of listing pages.
- About contains the shared TeamSection and /team redirects there; the work listing includes journal entries to keep navigation compact.
- LiveBackground supplies noninteractive circuit motion across the shared shell and respects reduced-motion preferences.
- BlueSection in motion.tsx owns scoped contrast tokens and scroll-linked circuit artwork for full-width color breaks, so page bands share accessible styling and reduced-motion behavior.
- Light/dark theme: the site follows the device (prefers-color-scheme) until the visitor picks light or dark in ThemeToggle, which stores that choice in localStorage; src/lib/theme.ts owns mode resolution plus the head init script that sets the class before first paint, and html.light overrides tokens in styles.css — one token set, no per-component light styles.
- Dashboard charts use shared BarChart/LineChart/DonutChart in Charts.tsx so chart styles stay varied but consistent.
- Console lives at /admin (ssr:false, inline login); access is the `admin` role in user_roles, granted by a signup trigger for the configured admin email — never by client checks.
- Leads and visits are written only by server functions in src/lib/site.functions.ts (service client, IP from request headers); admin UI reads/edits CMS and leads through the browser client under admin-only RLS.
- AI publishing uses a five-minute managed callback and one persisted stage per invocation (research, draft, cover/publish), guarded by a database lease and durable pause state; completion and post insertion are atomic to prevent duplicate work.
- Journal covers are held in private storage and served only for published posts through the public image route; this preserves the workspace ban on public buckets.
- Research suggestions are fetched only from approved publisher hosts; drafting uses fetched extracts and source links are assembled from verified URLs, because search-model citations alone are not evidence.
- Homepage, work listing and journal share postsQuery and BlogSection so latest CMS publications are visible in all journal placements; photographs are referenced through journal-images.ts.
- CMS posts render on /blogs and /blogs/$slug alongside the static editorial articles; CMS services render in the Solutions "All services" section.
- Blog cards and article headers use publicationDate for consistent India-time dates; shared article metadata covers both CMS and editorial detail pages.
- Calculator numbers come only from src/lib/estimator.ts (tested formulas); AI writes the explanation, so estimates stay consistent and auditable.
- Calculator results use zero-minimum grid tracks and a fixed-height scrolling panel; calculator plans and visitor chat share `.assistant-copy` typography so generated content cannot resize the layout or inherit article styling.
- Visitor chat streams through /api/public/chat; threads are keyed by the browser visitor ID and verified server-side before reading or writing, and chats are readable only by admins.
- Chat contact parsing lives in chat-contact.ts; saved contact details receive a deterministic acknowledgement so follow-up promises never depend on AI generation or imply an email was sent.
- The contact pop-up is a custom animated panel launched from the fixed right-edge button so it can grow from and shrink back into that button.
