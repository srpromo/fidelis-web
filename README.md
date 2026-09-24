# Fidelis Web Alpha 003 — Checkpoint 1

A public, deterministic visual checkpoint: arrival → thesis conversation → editable proposition → frozen thesis → research canvas shell. Discovery is disabled. No research, provider, market-data, authentication or execution service is connected.

The supplied canonical white Fidelis SVG is copied byte-for-byte into `public/fidelis-logo.svg`. Its source geometry and colors are unchanged.

## Run and validate

Use Node 24 and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm scan
```

GitHub Actions publishes the static build at `/fidelis-web/`.

## Checkpoint boundaries

`src/checkpoint` contains the conversational UI, a replaceable asynchronous local thesis-assistant adapter, a checkpoint reducer built around the existing `ResearchRun` contract, and a future `ResearchActivityEvent` seam. Only the actual local thesis-lock event is emitted. The same mounted logo and canvas transform after lock; retained conversation and frozen thesis can be reopened through the completed Thesis circle.

This temporary UX harness follows an AI-infrastructure thesis. It does not call or impersonate an external model. State remains in memory and resets on reload. Login is a visual placeholder.

The previous wash, discovery and expression modules remain unchanged and are not rendered by this checkpoint. Further product work requires visual approval of the opening, conversation and transition.
