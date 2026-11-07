# Nerrawave frontend

Minimal ChatGPT-style shell for **Nerrawave** — AI speech-to-text for interviews and long-form recordings (minute-based credits).

## Prerequisites

Use **Node.js 20.x** and **npm 10.x** (see `engines` in `package.json`).

## Run locally

From the **repository root**:

```bash
npm install
npm run dev
```

Or from this `frontend` folder:

```bash
npm install
npm run dev
```

If the site looks unstyled (white/black page with no design), stop the server and run:

```bash
npm run dev:clean
```

On Windows you can also double-click **`start-dev.cmd`** in this folder (frees port 3000, deletes `.next`, starts dev).

If you see **`missing required error components, refreshing...`**:

1. Stop **every** terminal running Next.js (do not run `npm run dev` and `npm start` at the same time).
2. Run **`npm run dev:clean`** or **`start-dev.cmd`** from this **`frontend`** folder.
3. Close the browser tab completely, then open a **new** tab to [http://localhost:3000/health](http://localhost:3000/health) — you should see JSON with `"ok": true` and `"app": "nerrawave-web"`.
4. Then open [http://localhost:3000/about](http://localhost:3000/about).

Do not run `npm run build` while the dev server is running — that can corrupt the cache.

Open [http://localhost:3000](http://localhost:3000).

## What's included

- ChatGPT-inspired layout with collapsible sidebar
- Light/dark mode (defaults to light on homepage)
- Interactive globe (legacy visual from the template)
- Mock auth (Google / LinkedIn / X / email)
- Mock tasks with unique URLs (`/task/[id]`) — UI still reflects the document-oriented template in places
- Static pages: About, Pricing, FAQs, Contact, Blog, Billing, Terms, Privacy

## Backend

Auth, billing, and processing are **mocked in the browser** (`localStorage`). Replace with real APIs when the backend is wired up.

## Sister product

**[Nerracell](https://nerracell.com)** is our document-translation product; this repo tracks **Nerrawave** only.
