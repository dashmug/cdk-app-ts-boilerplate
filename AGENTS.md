# AGENTS.md

## Project overview
- This repository is a single-package AWS CDK TypeScript boilerplate.
- The deployable app entry point is `bin/app.ts`.
- The main shared abstraction is `src/lib/base-stack.ts`; concrete infrastructure stacks should extend `BaseStack`, not `cdk.Stack` directly.
- The only real stack today is `src/stacks/project.ts`, which is intentionally thin boilerplate.

## Environment and package management
- Use `yarn`, not `npm`, `pnpm`, or `bun`, for project work. The repo is organized around `yarn.lock`, Make targets, and `yarn` scripts.
- Node 24 is the current baseline (`.node-version` is `24.14.0`, `package.json` requires `>=24`).
- If you need local hooks installed, prefer `make install`. `.npmrc` sets `ignore-scripts=true`, and the Make target explicitly runs `yarn husky init` after `yarn install`.

## Authoritative tooling
- Treat `package.json` scripts and `biome.json` as the source of truth for formatting and linting.
- Use Biome for all formatting/linting work:
  - `yarn format`
  - `yarn lint`
- If Biome output disagrees with `.editorconfig` or older docs, follow Biome.
- Do not reintroduce Prettier or ESLint conventions unless the repo is intentionally migrated back.
- Be aware that some human-facing docs/config still lag behind the current toolchain:
  - `README.md` still mentions Prettier and ESLint.
  - `.github/workflows/ci.yml` still uses Node 20 and runs `yarn prettier . --check`.
  - If you touch tooling or CI, reconcile those files instead of copying stale assumptions.

## Core commands
- `yarn format` — run Biome with writes
- `yarn lint` — run Biome checks without writes
- `yarn typecheck` — run TypeScript compiler with `noEmit`
- `yarn test` — run Jest
- `yarn synth` — synthesize the CDK app with validation
- `yarn nag` — synthesize with `NAG=1` to enable `cdk-nag`
- `yarn diff` — CDK diff
- `yarn deploy` — deploy all stacks without approval prompts
- `make checks` — convenience wrapper for `format`, `typecheck`, `test`, and `nag`

## Repository map
- `bin/app.ts` — CDK app entry point; instantiates stacks and conditionally enables `cdk-nag` aspects when `NAG` is set.
- `src/lib/base-stack.ts` — shared stack base class; centralizes env resolution and tagging.
- `src/stacks/project.ts` — concrete example stack.
- `src/**/__tests__/*.test.ts` — Jest tests for stacks and shared infrastructure code.
- `src/**/__snapshots__/*.snap` — Jest snapshots of synthesized CloudFormation templates.
- `cdk.json` — CDK CLI entrypoint plus feature flags.
- `tsconfig.json` — strict TypeScript settings; path aliases like `src/*` and `bin/*` are used throughout the repo.

## Infrastructure conventions
- New deployable stacks belong in `src/stacks/` and should be instantiated from `bin/app.ts`.
- Keep stack constructors simple and explicit. This repo is a scaffold, not a framework.
- Reuse `BaseStack` for shared tagging and environment behavior rather than creating parallel stack bases.
- `BaseStack` currently hardcodes the tag `application:environment` to `prod`. There is no real multi-environment abstraction yet; do not assume one exists.
- `BaseStack` reads `package.json` metadata at import time and turns it into resource tags. If you change package metadata or tag keys, update the affected tests and snapshots deliberately.

## Testing expectations
- For code changes, run the narrowest relevant checks first, then broaden as needed:
  - Stack/code changes: `yarn test`
  - Type-only or import-path changes: `yarn typecheck`
  - CDK resource changes: `yarn synth`
  - Security/compliance-sensitive infrastructure changes: `yarn nag`
- Snapshot tests are meaningful here. Do not update snapshots blindly; inspect the synthesized template diff and confirm it matches the intended infrastructure change.
- `src/lib/__tests__/base-stack.test.ts` asserts exact resource tags, not just snapshots. Changes to tags, package metadata, or `BaseStack` behavior will require deliberate test updates.

## Coding guidance
- Match the existing code style and let Biome format files. Current TS files use tabs and double quotes.
- Keep imports using the existing path aliases (`src/...`, `bin/...`) instead of long relative paths when applicable.
- Preserve strict TypeScript hygiene: this repo enables `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `exactOptionalPropertyTypes`, and related checks.
- Prefer simple CDK constructs over unnecessary helper layers. Add abstractions only when they clearly remove duplication across stacks.

## Agent-specific guardrails
- Before changing exported types, classes, or functions, find all references and update every affected call site.
- When touching `BaseStack`, also inspect:
  - `src/lib/__tests__/base-stack.test.ts`
  - `src/lib/__tests__/__snapshots__/base-stack.test.ts.snap`
  - any concrete stacks extending it
- When touching `src/stacks/project.ts`, also inspect:
  - `src/stacks/__tests__/project.test.ts`
  - `src/stacks/__tests__/__snapshots__/project.test.ts.snap`
  - `bin/app.ts`
- If you change CDK resources, verify both Jest output and synthesized templates; a passing typecheck alone is not sufficient.
- Prefer fixing stale repository guidance when you are already editing the relevant area. Do not add new contradictory conventions.