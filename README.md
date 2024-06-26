[![CI](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dashmug/cdk-app-ts-boilerplate/actions/workflows/github-code-scanning/codeql)

# CDK App Typescript Boilerplate

This is an opinionated boilerplate I use when building [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) applications.

For building open-source constructs, I recommend using [`projen`](https://github.com/projen/projen)'s `awscdk-construct` project type.

## Features

- Latest (best-effort) versions of dependencies
- Package management using `yarn`
- Strict Typescript config
- Auto-formatting via `prettier`
- Strict(ish) linting rules enforced by `eslint`
- Standard unit testing setup using `jest`
- Git hooks via `husky` and `link-staged`
- Standard commit messages using `commitlint`
- For VSCode users:
  - Recommended extensions
  - Pre-configured settings and launch configurations for debugging
- For Linux/Mac/WSL users:
  - `Makefile` with pre-configured commands for convenience
- For Github:
  - Built-in dependabot config
  - Built-in Github Actions workflows for pull requests and `main` branch
  - Scanning for cloud infrastructure misconfigurations via `checkov`
  - `shellcheck` for checking shell scripts
- CDK-specific:
  - Use of project-installed `cdk` instead of a globally-installed one
  - Use `BaseStack` instead of CDK's own `Stack` class to get some
    standard resource-tagging in place
  - Use of `cdk-nag` to statically check if best practices are followed

## Requirements

- Node 20+
- [yarn](https://classic.yarnpkg.com/) for package management

## Git Hooks

A few git hooks are set up during the project setup process (`make install`).

1. A `pre-commit` hook that runs some checks depending on the staged
   files. The hook itself is found at `.husky/pre-commit`.
2. A `commit-msg` hook that checks whether the commit message conforms to
   the `commitlint` spec. Allowed commit "types" are found in
   `commitlint.config.js`.

## Makefile targets

```
❯ make
Available commands:
help         Show help (default)
install      Install node dependencies
format       Format the project source code
lint         Check for common errors
typecheck    Check static type annotations
synth        Synthesize deployment code
build        Synthesize deployment code (alias of `synth`)
test         Execute unit tests
deploy       Deploy infrastructure
outdated     Check for outdated dependencies
upgrade      Upgrade dependencies
clean        Delete artifacts
checks       Runs format, typecheck, test and build
tag          Tags the current commit using CalVer
unreleased   Lists the commits since the latest tag
```
