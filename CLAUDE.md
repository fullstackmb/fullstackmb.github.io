# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The Full Stack Manitoba community website (fullstackmb.ca), built as a static site with Eleventy (11ty v3) using a custom JSX/TSX template pipeline, plus a small React "islands" bundle for client-side interactivity. Deployed to GitHub Pages via GitHub Actions.

## Commands

- `npm run dev` — build the client bundle once, then run 11ty dev server + client watch concurrently (serves at `http://localhost:8080`)
- `npm run build` — production build: `npm run client:build && eleventy` (CI runs this with `-- --pathprefix $PATH_PREFIX`)
- `npm run client:build` / `npm run client:watch` — bundle client-side React code only, via `build-client.js` (hand-written esbuild API script, not a config file)
- `npm run test:e2e` — Playwright e2e tests (single spec: `tests/e2e/home.spec.ts`). `test:e2e:ui` / `test:e2e:debug` for interactive runs. The Playwright `webServer` auto-starts `npm run dev` if not already running.
- `npm run clean` — removes `_site`

There is no unit test runner configured — Playwright e2e is the only test suite. `happy-dom` and `@testing-library/dom` are unused devDependencies (vestigial, not wired to anything).

- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run format` / `npm run format:check` — Prettier

Most of the existing codebase predates this lint/format setup and has not been reformatted or had lint warnings cleaned up — don't be surprised by pre-existing warnings/errors unrelated to your change; only fix what you touch unless asked to do a broader cleanup.

## Architecture

- **Server-side rendering**: 11ty (`eleventy.config.ts`, run via `tsx`) has a custom template handler for `.11ty.jsx/.11ty.tsx/.tsx/.ts` files under `pages/` and `src/`. Each page module is dynamically imported and rendered with `jsx-async-runtime`'s `renderToString` — this is not React SSR.
- **Client-side**: `src/components/client/main.tsx` is the entry point bundled separately by esbuild (`build-client.js`) into `_site/assets/client-bundle.js`, using real React (`jsxImportSource: react`). Only code under `src/components/client/**` runs in the browser as React.
- Two tsconfigs reflect this split: `tsconfig.json` (server/11ty side, `jsxImportSource: jsx-async-runtime`, `strict: false`) and `tsconfig.client.json` (browser bundle, `jsxImportSource: react`, `strict: true`, scoped to `src/components/client/**/*`).
- Path alias `@components/*` → `src/components/*` in both tsconfigs.
- `pages/` holds Markdown source content (11ty input dir); `src/_data/` holds global 11ty data; `src/_layouts/` holds 11ty layouts; `src/config/seo.ts` holds per-page SEO metadata.
- 11ty's automatic global-data-directory scanning (`.json`/`.js`/`.cjs` files in `src/_data/`, e.g. `board.json`) is what should be used for new static data files. `dir.data` in `eleventy.config.ts` is resolved relative to `dir.input` (`./pages`), not the project root — it's set to `'../src/_data'` (note the `../`, mirroring `layouts: '../src/_layouts'`) to actually land on `src/_data/`. `.ts` data files aren't picked up by this automatic scan, which is why `events.ts`/`version.ts` are instead wired manually via `eleventyConfig.addGlobalData(...)` in the same file.

## External data sources

- **Events** (`src/_data/events.ts`): fetched directly from Meetup's public iCal feed (`https://www.meetup.com/fullstackmb/events/ical/`, override via `EVENTS_ICAL_URL` env var), parsed with `node-ical`, cached on disk for 1h via `EleventyFetch`. iCal has no event-image field, so the event logo is chosen by exact title match against a hardcoded `LOGO_BY_TITLE` map in that file, falling back to a default — this is inherently brittle (a renamed/retitled recurring event silently gets the default logo, no error).
- **Board members / sponsors** (`src/_data/board.json`, `src/_data/sponsors.json`): plain static data files, hand-edit and commit when they change — no fetch, no backend. Originally served by [`fullstackmb/fullstackmbapi-2020`](https://github.com/fullstackmb/fullstackmbapi-2020) (ASP.NET Core, `fullstackmbapi` Azure Web App), which is largely stale (real code changes years apart); these files were seeded from that API's last-known-good response, but nothing here calls it anymore.
- **Slack signup** (`src/components/client/SlackInviteForm.tsx`): POSTs to the same backend's `/api/slack`, which calls Slack's deprecated `users.admin.invite` legacy endpoint. Per Slack's docs this should be Enterprise-Grid-only, but it has been empirically confirmed still working for this workspace — don't "fix" it by assuming the docs are right.

## Gotchas

- `build-client.js` hardcodes `process.env.NODE_ENV = "development"` unconditionally — there is currently no prod/dev differentiation in the client bundle (no minification even in the "production" build).
- In 11ty dev mode, the template handler shells out to `exec('npm run build', ...)` on every template compile when the path includes `src/` — this is how client-bundle changes get picked up during `npm run dev`, but it's fragile self-triggering rebuild logic, not a standard 11ty watch mechanism.

## CI/CD

Single workflow `.github/workflows/ci-cd.yml`, triggered on push to `main`/`ft/*`/`hf/*`, PRs to `main`, and a daily cron. Playwright e2e tests only run when `github.ref_name == 'main'` or the event is a PR (not on feature-branch pushes). Deploy to GitHub Pages only happens after a successful build on `main`, via `actions/deploy-pages`.

## Conventions

- Branch naming: `ft/*` for features, `hf/*` for hotfixes; external contributors use fork branches like `fix/...` or `update/...`.
- Commits mix conventional-commit prefixes (`fix:`, `feat:`) with plain-English messages — not strictly enforced.
- Nearly all merges to `main` go through PRs (including from Dependabot).
