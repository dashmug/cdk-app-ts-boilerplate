module.exports = {
  "*.js": ["prettier --write", "eslint --quiet --fix --cache"],
  "*.ts": () => [
    "yarn format",
    "yarn typecheck",
    "yarn test -- --only-changed",
  ],
  "*.{json,yml,md}": "prettier --write --ignore-unknown",
  "*.sh": "shellcheck",
};
