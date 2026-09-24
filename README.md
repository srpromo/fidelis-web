# Fidelis Web Alpha 003 — Checkpoint 5

A public React/TypeScript prototype of a continuous thesis-to-research experience, implemented through Wash 3 and user finalist selection. All analytical results and activity are sanitized deterministic demonstration fixtures. No live research, provider, market-data, authentication or execution service is connected.

The active journey is observation → thesis conversation/editing → thesis lock → Discovery and candidate curation → Wash 1: Reality & Recognition → Wash 2: Thesis Survival → Wash 3: Adversarial Confirmation → finalist selection. Proceed to Expression saves the local selection and displays a checkpoint stop. Expression and completed Result are not implemented in the active Alpha journey.

This status describes implementation baseline `0c50bca0f2551ba1ee280e3c47262144982f45ee`; subsequent documentation commits do not change that behavior.

## Experience and state

The temporary thesis assistant produces one deterministic response around an AI-infrastructure example to accelerate UX review. Production conversation length is intended to depend on thesis sufficiency, not a fixed turn count. Enter submits; Shift+Enter inserts a newline; composition input is protected. The user can edit and approve the thesis before locking it.

After lock, the canonical white logo shrinks while remaining centered above the compact sticky progression rail. Activity and results unfold in one mounted canvas. Completed/current stages are navigable; future stages remain disabled. Viewing history does not rerun research or roll back progress. Prior-stage selections and user exclusions remain preserved.

ResearchRun is the primary presentation state: conversation, frozen thesis, candidate history, curation, wash results, T0–T3 trajectories and finalists remain part of the same journey. Exclusion is separate from analytical rejection and never deletes history. Eligible finalists are explicitly selected by the user; upstream failure or insufficient evidence cannot be repaired by proceeding to Expression.

The interface retains a black foundation, restrained white/gray palette, compact typography, progressive disclosure, meaningful state transitions, keyboard access and reduced-motion behavior. The supplied canonical SVG in `public/fidelis-logo.svg` retains its original geometry and colors.

State is in memory and resets on reload. Backend persistence and account claiming are not implemented. Authentication and entitlement boundaries are disabled for Alpha review; login is a placeholder. This does not define future commercial policy.

## Frontend architecture

- `src/checkpoint`: thesis interaction, ResearchRun reducer, research header and progression navigation.
- `src/discovery`: typed activity/state, pathway and candidate fixtures, Recall, inspection and curation.
- `src/wash1`, `src/wash2`, `src/wash3`: stage-specific typed models, normalized fixtures, state transitions and presentation. Wash 3 includes adversarial challenges, evidence conflicts, comparative tradeoffs, T3 trajectories and finalist selection.
- `src/test`: automated regression coverage for the implemented journey, state preservation, interaction and stage boundaries.

Fixture data, analytical state and presentation remain separate. Earlier prototype modules outside this active journey do not establish shipped Expression or Result functionality.

The future integration seam is a bounded API delivering normalized results and meaningful research-activity events to ResearchRun. The public client presents interactions and explanations; private engine methodology and any administrative control plane remain outside this client. Current simulated activity must not be mistaken for actual backend work. Live integration, provider comparison, persistence and administrative capabilities require separately authorized implementation.

## Develop and validate

Use Node 24 and pnpm 11.19.0, matching the existing workflow:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm scan
```

The automated tests validate deterministic behavior. Browser review additionally covers desktop/mobile layout, keyboard interaction, reduced motion, historical navigation and the non-executing Expression stop. `pnpm scan` checks the production distribution for prohibited content; review source changes for publication safety as well.

## Build and deployment

Vite uses `/fidelis-web/` as its asset base. The existing `.github/workflows/web-alpha-pages.yml` workflow runs validation, builds `dist`, and deploys that static output on pushes to `main` or manual dispatch. GitHub Pages uses GitHub Actions as its deployment source.

Live Alpha: <https://srpromo.github.io/fidelis-web/>.

Only the isolated public frontend belongs in this repository. Do not include credentials, private engine implementation, research evidence, internal artifacts or private filesystem paths. The static demonstration requires no runtime secrets and makes no research/provider requests.
