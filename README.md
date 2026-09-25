# Fidelis Web Alpha 003 — Complete through Result

A public React/TypeScript prototype of a continuous thesis-to-research experience, implemented through Expression and completed Result. All analytical results and activity are sanitized deterministic demonstration fixtures. No live research, provider, market-data, option-chain, authentication or execution service is connected.

The active journey is observation → thesis conversation/editing → thesis lock → Discovery and candidate curation → Wash 1: Reality & Recognition → Wash 2: Thesis Survival → Wash 3: Adversarial Confirmation → finalist selection → Expression → Result. Each selected finalist retains its confirmed demonstration expression and independent completed output. Result summarizes saved research without another research pass, then ends the journey.

This status describes implementation baseline `d798c0a5834eb45118abde4e55fea8cd4fbf534e`; subsequent documentation commits do not change that behavior.

Scott is entering an extended Alpha 003 review/refinement period. The current UX is not presumed final; structural, experience and cosmetic findings will be captured separately. Completion does not start live integration.

## Experience and state

The temporary thesis assistant produces one deterministic response around an AI-infrastructure example to accelerate UX review. Production conversation length is intended to depend on thesis sufficiency, not a fixed turn count. Enter submits; Shift+Enter inserts a newline; composition input is protected. The user can edit and approve the thesis before locking it.

After lock, the canonical white logo shrinks while remaining centered above the compact sticky progression rail. Activity and results unfold in one mounted canvas. Completed/current stages are navigable; all seven are available after Result. The completed header shows Research Complete with no next-stage action. Viewing history does not rerun research or roll back progress. Prior-stage selections and user exclusions remain preserved.

ResearchRun is the primary presentation state: conversation, frozen thesis, candidate history, curation, wash results, T0–T3 trajectories, finalists, Expression and Result remain part of the same journey. Exclusion is separate from analytical rejection and never deletes history. Eligible finalists are explicitly selected by the user; upstream failure or insufficient evidence cannot be repaired by proceeding to Expression.

The interface retains a black foundation, restrained white/gray palette, compact typography, progressive disclosure, meaningful state transitions, keyboard access and reduced-motion behavior. The supplied canonical SVG in `public/fidelis-logo.svg` retains its original geometry and colors.

State is in memory and resets on reload. Backend persistence and account claiming are not implemented. Authentication and entitlement boundaries are disabled for Alpha review; login is a placeholder. This does not define future commercial policy.

## Frontend architecture

- `src/checkpoint`: thesis interaction, ResearchRun reducer, research header and progression navigation.
- `src/discovery`: typed activity/state, pathway and candidate fixtures, Recall, inspection and curation.
- `src/wash1`, `src/wash2`, `src/wash3`: stage-specific typed models, normalized fixtures, state transitions and presentation. Wash 3 includes adversarial challenges, evidence conflicts, comparative tradeoffs, T3 trajectories and finalist selection.
- `src/expression`: independent finalist preferences, qualitative strategy-family comparison and explicit confirmation.
- `src/result`: synthesis of saved research, qualitative Thesis Support, separate Evidence Confidence, Case For/Against, failure conditions and history inspection. No calibrated probability or current contract recommendation is supplied.
- `src/test`: automated regression coverage for the implemented journey, state preservation, interaction and stage boundaries.

Fixture data, analytical state and presentation remain separate. Completed Result uses the saved research and confirmed Expression state; it performs no new research or option execution.

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

The automated tests validate deterministic behavior. Browser review additionally covers desktop/mobile layout, keyboard interaction, reduced motion, historical navigation and the complete Observation-to-Result journey. `pnpm scan` checks the production distribution for prohibited content; review source changes for publication safety as well.

## Build and deployment

Vite uses `/fidelis-web/` as its asset base. The existing `.github/workflows/web-alpha-pages.yml` workflow runs validation, builds `dist`, and deploys that static output on pushes to `main` or manual dispatch. GitHub Pages uses GitHub Actions as its deployment source.

Live Alpha: <https://srpromo.github.io/fidelis-web/>.

Only the isolated public frontend belongs in this repository. Do not include credentials, private engine implementation, research evidence, internal artifacts or private filesystem paths. The static demonstration requires no runtime secrets and makes no research/provider requests.
