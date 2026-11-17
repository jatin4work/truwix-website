# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Deploying to Vercel

This app runs server code (server functions + `/api` routes), so it needs a host
that runs a server, not just files. Vercel is supported: Nitro (already in
`package.json`) detects Vercel during the build and emits the matching server
output automatically.

**1. Get the code into a repository you control**

In Lovable: **Project settings → Git → connect GitHub**. That creates a private
repository holding this code. Then in Vercel: **Add New → Project → import that
repository**, and pick the branch Lovable syncs (or a release branch you merge into).

**2. Build settings**

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | none needed (Nitro's Vercel preset handles it) |
| Node.js version | 22 |
| Install | Bun — the repo ships `bun.lock`. If you change the install command to npm, commit a generated `package-lock.json` first. |

No `vercel.json`, no `_redirects`, no rewrite rules: TanStack Start routes are
served by the Nitro Vercel output.

**3. Environment variables** (Vercel → Project → Settings → Environment Variables)

| Name | Where it comes from | Needed for |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | this repo's `.env` | browser reads the backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | this repo's `.env` | browser reads the backend |
| `SUPABASE_URL` | this repo's `.env` | server reads the backend |
| `SUPABASE_PUBLISHABLE_KEY` | this repo's `.env` | server reads the backend |
| `SUPABASE_SERVICE_ROLE_KEY` | your own backend project's settings — **not** available while the backend is Lovable Cloud's managed instance | server-side writes: leads, visits, chat, calculator, journal cover images, blog publishing |
| `LOVABLE_API_KEY` | Lovable AI gateway key; replace with your own AI provider key once hosted elsewhere | chat assistant, calculator's written plan, AI blog writing and covers |
| `LOVABLE_CRON_SECRET` | only if you recreate the daily blog job on Vercel | protects `/api/public/jobs/generate-blogs` |

Never commit `SUPABASE_SERVICE_ROLE_KEY` or any other secret — `.env` is tracked
in this repo and only ever holds publishable values.

**4. Sign-in redirect URLs**

Add the Vercel URL (and each preview URL you want to use) to the backend's
allowed redirect URLs, or `/admin` sign-in will bounce.

**5. Daily blog publishing**

The current schedule lives on the managed backend and calls a route on Lovable's
own hosting, so it does not fire against Vercel. Recreate it as a Vercel Cron
(`vercel.json` → `crons`) that POSTs `{"count":3}` to
`/api/public/jobs/generate-blogs` with `Authorization: Bearer <LOVABLE_CRON_SECRET>`,
and keep the staged pipeline (one stage per call) so each request stays inside
the function time limit.

**What works immediately on Vercel:** all pages, the journal and article pages,
the services list, the calculator's own numbers, and the `/admin` console
(sign in with the admin account; it reads and writes through the browser under
row-level security).

**What needs the two keys above first:** saving enquiries from the contact form,
pop-up and calculator; visit tracking; chat history and the chat assistant;
journal cover images; and automated blog publishing.
