# Fidelis Web Alpha 002

A deterministic, public demonstration of a thesis-to-expression research journey. The interface preserves an observation, versioned thesis composition, locked thesis, causal discovery map, user curation, three research washes, chronological OPS/RAP snapshots, finalist selection, expression preferences, and a completed case for/against.

All candidate findings, coordinates, market states and structures are sanitized illustrative fixtures. They are not live research, calibrated probabilities, market quotes, or execution recommendations. No provider, research, market-data or option-chain calls occur. The canonical Fidelis SVG is pending; only a text wordmark is used.

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

GitHub Actions builds and deploys static assets with the `/fidelis-web/` base path. No runtime secrets are needed.

## Product boundaries

`ResearchRun` is the primary in-memory state object. The reducer preserves locked thesis versions, user decisions, completed snapshots, provenance, and expression preferences throughout the session. Reloading starts a fresh demonstration. A candidate excluded before a later wash keeps its original history; missing snapshots are never invented. Analytical holds are distinct from user exclusions. Thesis failures cannot enter finalist selection.

Product-oriented components separate composition, discovery/curation, research progression, wash analysis, visual history, finalists, expression, and output. Provider contracts anticipate different reasoning providers consuming the same frozen evidence and deterministic snapshot. No provider connectivity is implemented. Independent authentication and entitlement policy boundaries are disabled; anonymous-to-owned continuity is a pure state transition.

The demonstration ends at research output. No account service, payment, monitoring, portfolio, orders, private engine code, methodology weights, calibration data or operational control console is included.
