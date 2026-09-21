# Fidelis Web Alpha 001

A static React/TypeScript presentation layer. All scores, eligibility, ranking and dispositions are deterministic demonstration fixtures; they are not research results. No engine execution, backend, credentials or external runtime data access.

Node 24 and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm scan
```

The Vite base is `/fidelis-web/`. GitHub Actions publishes only `dist`, never any private engine data. Enable GitHub Pages with GitHub Actions as its source. No runtime secrets are required.

Contracts live in `src/types.ts`, fixture construction in `src/data/demo.ts`, and UI surfaces in `src/components`. Replace the fixture boundary with a bounded Fidelis API service in a separately authorized phase; engine logic remains in Python.
