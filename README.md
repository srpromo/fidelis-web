# Fidelis Web Alpha 003 — Checkpoint 2

A public, deterministic visual checkpoint: arrival → thesis conversation → editable proposition → frozen thesis → Discovery activity, causal mapping and candidate curation. Wash 1 is not executed. No research, provider, market-data, authentication or execution service is connected.

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

`src/checkpoint` contains the conversational UI, a replaceable asynchronous local thesis-assistant adapter, a checkpoint reducer built around the existing `ResearchRun` contract, and a future `ResearchActivityEvent` seam. The local thesis-lock event is followed by ordered typed Discovery fixture events. The same mounted logo and canvas transform after lock; retained conversation and frozen thesis can be reopened through the completed Thesis circle.

This temporary UX harness follows an AI-infrastructure thesis. It does not call or impersonate an external model. State remains in memory and resets on reload. Login is a visual placeholder.

`src/discovery` separates typed event/state contracts, sanitized fixtures and presentation. Nine demonstration candidates are examined: seven validated (including one Recall addition), two rejected. Exclusions and re-inclusions preserve Discovery history. The Proceed affordance only marks local state ready for a future save; it does not persist remotely or execute Wash 1.

The previous wash and expression modules remain unchanged and are not rendered. Further product work requires visual approval of Discovery.
