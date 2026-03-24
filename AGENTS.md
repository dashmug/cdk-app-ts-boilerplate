# AGENTS.md

## Project overview
- This repository is a single-package AWS CDK TypeScript boilerplate.
- The deployable app entry point is `bin/app.ts`.
- The main shared abstraction is `src/lib/base-stack.ts`; concrete
  infrastructure stacks should extend `BaseStack`, not `cdk.Stack`
  directly.
- The only deployable stack today is `src/stacks/project.ts`, which is
  intentionally thin boilerplate around a single DynamoDB table.

## Environment and package management
- Use `yarn`, not `npm`, `pnpm`, or `bun`, for project work. The repo is
  organized around `yarn.lock`, `yarn` scripts, and Makefile wrappers.
- Node 24 is the current baseline. `package.json` requires `>=24`, and
  `.github/workflows/ci.yml` runs on Node 24.x.
- Prefer `make install` for the documented local setup path on Linux,
  macOS, and WSL. It runs `yarn install` and `yarn husky init`.
- If you edit or commit shell scripts, make sure `shellcheck` is
  installed locally; both the pre-commit workflow and CI rely on it.

## Authoritative tooling
- Treat `package.json` scripts as the source of truth for command
  behavior and `Makefile` targets as convenience wrappers.
- Treat `biome.json` as the source of truth for formatting and linting.
  Use Biome for all formatting/linting work:
  - `yarn format`
  - `yarn lint`
- Treat `cdk.json` as the source of truth for how the CDK app is
  executed and which feature flags are enabled.
- If Biome output disagrees with `.editorconfig`, older docs, or editor
  defaults, follow Biome.
- Do not reintroduce Prettier or ESLint conventions unless the repo is
  intentionally migrated back.

## Core commands
- `yarn format` — run Biome with writes
- `yarn lint` — run Biome checks without writes
- `yarn typecheck` — run TypeScript compiler with `noEmit`
- `yarn test` — run Jest
- `yarn synth` — synthesize the CDK app with validation
- `yarn nag` — synthesize with `NAG=1` so `cdk-nag` runs
- `yarn diff` — CDK diff
- `yarn deploy` — deploy all stacks without approval prompts
- `make checks` — convenience wrapper for `format`, `typecheck`, `test`,
  and `nag`
- `make` — print the available Makefile targets

## Repository map
- `bin/app.ts` — CDK app entry point; instantiates `MyProjectStack` and
  conditionally enables `cdk-nag` aspects when `NAG` is set.
- `src/lib/base-stack.ts` — shared stack base class; defaults
  account/region from `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION`,
  then applies common tags.
- `src/stacks/project.ts` — concrete example stack; currently creates
  one DynamoDB table with `pk`/`sk`, point-in-time recovery, and
  customer-managed encryption.
- `src/**/__tests__/*.test.ts` — Jest tests for stacks and shared
  infrastructure code.
- `src/**/__snapshots__/*.snap` — Jest snapshots of synthesized
  CloudFormation templates.
- `cdk.json` — CDK CLI entrypoint plus feature flags; runs the app
  through `tsx`.
- `tsconfig.json` — strict TypeScript settings with `noEmit` and
  `resolveJsonModule`; no path aliases are configured today.
- `.husky/pre-commit` + `lint-staged.config.js` — staged-file checks for
  JS/TS and shell scripts.
- `.husky/commit-msg` + `commitlint.config.js` — Conventional Commit
  enforcement with a restricted type list and sentence-case subjects.
- `.github/workflows/ci.yml` — CI jobs for lint/typecheck/test/nag,
  deployment artifact validation with Checkov, and shell script
  validation.

## Infrastructure conventions
- New deployable stacks belong in `src/stacks/` and should be
  instantiated from `bin/app.ts`.
- Keep stack constructors simple and explicit. This repo is a scaffold,
  not a framework.
- Reuse `BaseStack` for shared tagging and environment behavior rather
  than creating parallel stack bases.
- `BaseStack` currently hardcodes the tag `application:environment` to
  `prod`. There is no real multi-environment abstraction yet; do not
  assume one exists.
- `BaseStack` reads `package.json` metadata at import time and turns it
  into resource tags. If you change package metadata or tag keys, update
  the affected tests and snapshots deliberately.
- `BaseStack` still contains placeholder values such as `myorg`,
  `myproject`, `myteam`, and `myclient`. Replace them deliberately when
  turning the scaffold into a real project.
- `cdk-nag` checks are opt-in during normal development. A plain `yarn
  synth` or `yarn deploy` does not add the aspects; `yarn nag` does.

## Testing expectations
- For code changes, run the narrowest relevant checks first, then
  broaden as needed:
  - Stack/code changes: `yarn test`
  - Type-only or import-path changes: `yarn typecheck`
  - CDK resource changes: `yarn synth`
  - Security/compliance-sensitive infrastructure changes: `yarn nag`
- Snapshot tests are meaningful here. Do not update snapshots blindly;
  inspect the synthesized template diff and confirm it matches the
  intended infrastructure change.
- `src/lib/__tests__/base-stack.test.ts` asserts exact resource tags,
  not just snapshots. Changes to tags, package metadata, or `BaseStack`
  behavior will require deliberate test updates.

## Developer workflow
- `yarn install` installs dependencies; `make install` is the preferred
  setup path when you also want the documented hook setup flow.
- Pre-commit runs `yarn lint-staged`:
  - staged `*.js`/`*.ts`: `yarn format`, `yarn typecheck`, `yarn test --
    --only-changed`
  - staged `*.sh`: `shellcheck`
- Commit messages are validated by commitlint. Allowed types are `feat`,
  `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`,
  `perf`, `build`, and `release`. Subjects must use sentence case.
- `.vscode/settings.json` defaults JS/TS formatting to Biome and
  configures Jest integration. `.vscode/extensions.json` recommends AWS
  Toolkit, Biome, Jest, and cSpell.

## Coding guidance
- Match the existing code style and let Biome format files. Current TS
  files use tabs and double quotes.
- Keep imports consistent with the current repository style. There are
  no `tsconfig` path aliases configured today, so existing imports are
  relative.
- Preserve strict TypeScript hygiene: this repo enables
  `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
  `exactOptionalPropertyTypes`, and related checks.
- Prefer simple CDK constructs over unnecessary helper layers. Add
  abstractions only when they clearly remove duplication across stacks.

## Agent-specific guardrails
- Before changing exported types, classes, or functions, find all
  references and update every affected call site.
- When touching `BaseStack`, also inspect:
  - `src/lib/__tests__/base-stack.test.ts`
  - `src/lib/__tests__/__snapshots__/base-stack.test.ts.snap`
  - any concrete stacks extending it
  - docs that describe tagging or onboarding, especially `README.md`
- When touching `src/stacks/project.ts`, also inspect:
  - `src/stacks/__tests__/project.test.ts`
  - `src/stacks/__tests__/__snapshots__/project.test.ts.snap`
  - `bin/app.ts`
  - `README.md` if the example scaffold description changes
- If you change CDK resources, verify both Jest output and synthesized
  templates; a passing typecheck alone is not sufficient.
- If you change local workflow or tooling, reconcile the affected
  docs/config together: `AGENTS.md`, `README.md`, `package.json`,
  `Makefile`, `.github/workflows/ci.yml`, `.husky/*`, and `.vscode/*` as
  applicable.
- When making code, config, or behavior changes, update `AGENTS.md` and
  `README.md` in the same change whenever either document describes the
  affected behavior. Do not leave documentation drift for later.
- Prefer fixing stale repository guidance when you are already editing
  the relevant area. Do not add new contradictory conventions.
