[![CI](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/ci.yml)

# CDK App TypeScript Boilerplate

Opinionated single-package [AWS Cloud Development Kit
(CDK)](https://aws.amazon.com/cdk/) scaffold for application
infrastructure written in TypeScript.

The repository currently ships one example stack (`MyProjectStack`) and
a shared `BaseStack` that centralizes default environment resolution and
resource tags. It is meant to be copied and customized, not used
unchanged.

For reusable open-source constructs,
[`projen`](https://github.com/projen/projen)'s `awscdk-construct`
project type is still the better starting point.

## What this boilerplate includes

- Node 24 + Yarn workflow
- Strict TypeScript configuration with `noEmit`
- Biome for formatting and linting
- Jest tests, including CloudFormation snapshot tests
- Project-local CDK CLI execution via `tsx`
- Opt-in `cdk-nag` checks through `yarn nag`
- Husky, lint-staged, and commitlint for local guardrails
- GitHub Actions CI for lint, typecheck, tests, `cdk-nag`, synth,
  Checkov, and shell script validation
- VSCode workspace settings plus recommended extensions

## Current scaffold

- `bin/app.ts` instantiates a single stack: `MyProjectStack`.
- `src/lib/base-stack.ts` extends `cdk.Stack`, defaults `env.account`
  and `env.region` from `CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`,
  and applies package- and project-level tags to taggable resources.
- `src/stacks/project.ts` defines one DynamoDB table with `pk` / `sk`,
  point-in-time recovery, and customer-managed encryption.
- `cdk-nag` checks are only enabled when `NAG=1` is set, or when you run
  `yarn nag`.
- `BaseStack` still contains placeholder values such as `myorg`,
  `myproject`, `myteam`, and `myclient`, and hardcodes
  `application:environment=prod`. Replace those before treating this as
  production-ready infrastructure.

## Prerequisites

- Node 24+
- [Yarn](https://classic.yarnpkg.com/)
- AWS credentials/configuration for the account and region you want to
  target
- [`shellcheck`](https://www.shellcheck.net/) if you plan to edit or
  commit `.sh` files
- A bootstrapped CDK v2 environment before the first deploy

## Quick start

1. Install dependencies and local hooks.

   ```sh
   make install
   ```

   `make install` is the documented setup path on Linux, macOS, and WSL.
   If you prefer, `yarn install` also installs dependencies.

2. Run the baseline checks.

   ```sh
   yarn test
   yarn synth
   ```

3. Replace the scaffold values before building real infrastructure.

   - Update the tag prefix and placeholder tags in
     `src/lib/base-stack.ts`.
   - Replace the example DynamoDB table in `src/stacks/project.ts`.
   - Rename the stack class and stack ID in `bin/app.ts` to match your
     project.

4. Bootstrap the target account/region before the first deployment.

   ```sh
   yarn cdk bootstrap aws://ACCOUNT/REGION
   ```

5. Deploy with the project-local CDK CLI.

   ```sh
   yarn deploy
   ```

## Repository tour

| Path | Purpose |
| --- | --- |
| `bin/app.ts` | CDK entrypoint. Instantiates stacks and conditionally enables `cdk-nag` aspects when `NAG` is set. |
| `src/lib/base-stack.ts` | Shared base stack. Applies default `env` values and common tags derived partly from `package.json`. |
| `src/stacks/project.ts` | Example infrastructure stack. Replace this with your real resources. |
| `src/lib/__tests__/base-stack.test.ts` | Verifies `BaseStack` tag behavior and snapshot output. |
| `src/stacks/__tests__/project.test.ts` | Snapshot test for the example stack template. |
| `cdk.json` | CDK app command and feature flags. The app runs through `tsx`, not compiled JavaScript. |
| `tsconfig.json` | Strict TypeScript settings. `noEmit` is enabled, and no path aliases are configured. |
| `.github/workflows/ci.yml` | CI pipeline for lint/typecheck/test/nag, synth + Checkov, and shell script checks. |

## Common commands

The Makefile is a thin convenience wrapper around the Yarn commands
below. Run `make` to see the full target list.

| Command | What it does |
| --- | --- |
| `yarn format` | Run Biome with writes. |
| `yarn lint` | Run Biome checks without writing changes. |
| `yarn typecheck` | Run `tsc` with `noEmit`. |
| `yarn test` | Run Jest. |
| `yarn synth` | Synthesize the CDK app with validation. |
| `yarn nag` | Synthesize with `NAG=1` so `cdk-nag` rules run. |
| `yarn diff` | Show a CDK diff. |
| `yarn deploy` | Deploy all stacks without approval prompts. |
| `make checks` | Run `format`, `typecheck`, `test`, and `nag` in sequence. |

## Development workflow

### Formatting and linting

This repository uses [Biome](https://biomejs.dev/) for formatting and
linting. The committed VSCode workspace settings default JavaScript and
TypeScript files to the Biome extension, with format-on-save enabled.

Current TypeScript style is intentionally simple: tabs for indentation,
double quotes, and relative imports. There are no `tsconfig` path
aliases in this scaffold today.

### Testing

Jest tests exercise the CDK stacks by snapshotting synthesized
CloudFormation templates. `src/lib/__tests__/base-stack.test.ts` also
asserts the exact resource tags emitted by `BaseStack`, so tag or
package metadata changes are expected to update tests deliberately.

When you change infrastructure, do not update snapshots blindly. Run
`yarn synth`, inspect the generated template diff, and make sure the
snapshot change matches the intended infrastructure change.

### Git hooks and commit messages

After install, Husky enables two hooks:

1. `pre-commit` runs `yarn lint-staged`. For staged `*.js` and `*.ts`
   files that means `yarn format`, `yarn typecheck`, and `yarn test --
   --only-changed`. For staged `*.sh` files it runs `shellcheck`.
2. `commit-msg` runs commitlint. Allowed commit types are `feat`, `fix`,
   `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`, `perf`,
   `build`, and `release`. Subjects must use sentence case.

### CI

GitHub Actions currently runs three jobs on pull requests and pushes to
`main`:

- Standard Node.js checks: `yarn lint`, `yarn typecheck`, `yarn test
  --ci`, and `yarn nag`
- Deployment artifact validation: `yarn synth`, then Checkov over
  `cdk.out` and `.github`
- Shell script validation with `shellcheck`

## CDK conventions in this repo

- Extend `BaseStack`, not `cdk.Stack`, for deployable stacks in this
  repository.
- Instantiate new stacks from `bin/app.ts`.
- Keep stack constructors simple and explicit; this scaffold is
  intentionally thin.
- `BaseStack` derives some tags from `package.json`, skips falsy tag
  values, and uses a hard-coded `application:environment=prod` tag.
- `cdk.json` runs the app with `tsx --trace-deprecation
  --unhandled-rejections=strict bin/app.ts`. TypeScript is executed
  directly; no JavaScript build output is written to disk.
- The example stack currently provisions a DynamoDB table with
  customer-managed encryption and point-in-time recovery. Replace that
  with infrastructure that matches your actual requirements.

## First customization checklist

Use this list to turn the scaffold into your own project quickly:

- Rename `MyProjectStack` and the stack ID used in `bin/app.ts`.
- Replace the `BaseStack` tag prefix and placeholder metadata values.
- Replace the demo DynamoDB table with real resources.
- Review which `cdk-nag` packs should stay enabled or be added.
- Re-run `yarn test`, `yarn synth`, and `yarn nag` after each
  infrastructure change.
- Update this README and `AGENTS.md` whenever code, infrastructure,
  tooling, or workflow changes make either document inaccurate. Keep the
  docs in sync with the repository, not your intent for it.
