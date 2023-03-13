# colors
BLUE:=$(shell echo "\033[0;36m")
GREEN:=$(shell echo "\033[0;32m")
YELLOW:=$(shell echo "\033[0;33m")
RED:=$(shell echo "\033[0;31m")
END:=$(shell echo "\033[0m")


.PHONY: help
help: ## Show help (default)
	@echo "Available commands:"
	@grep --extended-regexp '^[ /.a-zA-Z0-9_-]+:.*?## .*$$' Makefile | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'


.PHONY: install
install: ## Install node dependencies
	@yarn install


.PHONY: format
format: ## Format the project source code
	@yarn format
	@yarn lint --fix


.PHONY: lint
lint: ## Check for common errors
	@yarn prettier . --check
	@yarn lint
	@yarn shellcheck .husky/pre-commit .husky/commit-msg


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


.PHONY: clean
clean: ## Delete artifacts
	@rm -rf .eslintcache cdk.out coverage


.PHONY: checks
checks: lint typecheck test ## Runs lint, typecheck, and test


.PHONY: tag
tag: ## Tags the current commit using CalVer
	@echo "$(BLUE)Fetching remote tags...$(END)"
	@git fetch --tags --force
	@git tag $(shell echo v$$(date +"%Y.%m.%d")) || git tag $(shell echo v$$(date +"%Y.%m.%d")`git tag --list | grep v$$(date +"%Y.%m.%d") | wc -l | sed 's/^ */./;s/ *$$//'`)
	@echo "$(BLUE)Pushing tags to remote...$(END)"
	@git push --tags
	@echo "$(BLUE)Done.$(END)"


.PHONY: unreleased
unreleased: ## Lists the commits since the latest tag
	@git log master...$$(git describe --tags --abbrev=0)
