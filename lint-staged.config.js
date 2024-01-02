module.exports = {
  "*.js": ["prettier --write", "eslint --quiet --fix --cache"],
  "*.ts": () => [
    "pnpm format",
    "pnpm typecheck",
    "pnpm test -- --only-changed",
  ],
  "*.{json,yml,md}": "prettier --write --ignore-unknown",
  "*.sh": "shellcheck",
};
