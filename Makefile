.PHONY: all
all: ## Show help (default)
	@echo "Available commands:"
	@grep --extended-regexp '^[ /.a-zA-Z0-9_-]+:.*?## .*$$' Makefile | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'


.PHONY: install
install: ## Install node dependencies
	@yarn install
	@yarn husky init


.PHONY: format
format: ## Format the project source code
	@yarn format
	@yarn lint --fix


.PHONY: lint
lint: ## Check for common errors
	@yarn prettier . --check
	@yarn lint


.PHONY: typecheck
typecheck: ## Check static type annotations
	@yarn typecheck


.PHONY: synth
synth: ## Synthesize deployment code
	@yarn synth


.PHONY: build
build: synth ## Synthesize deployment code (alias of `synth`)


.PHONY: test
test: ## Execute unit tests
	@yarn test


.PHONY: deploy
deploy: ## Deploy infrastructure
	@yarn deploy


.PHONY: outdated
outdated: ## Check for outdated dependencies
	@yarn outdated


.PHONY: upgrade
upgrade: ## Upgrade dependencies
	@yarn upgrade-interactive --latest
	@yarn upgrade


.PHONY: clean
clean: ## Delete artifacts
	@rm -rf .eslintcache cdk.out coverage


.PHONY: checks
checks: format typecheck test build ## Runs format, typecheck, test and build


.PHONY: tag
tag: ## Tags the current commit using CalVer
	@git fetch --tags --force
	@git tag $(shell echo v$$(date +"%Y.%m.%d")) || git tag $(shell echo v$$(date +"%Y.%m.%d")`git tag --list | grep v$$(date +"%Y.%m.%d") | wc -l | sed 's/^ */./;s/ *$$//'`)
	@git push --tags


.PHONY: unreleased
unreleased: ## Lists the commits since the latest tag
	@git log master...$$(git describe --tags --abbrev=0)
