module.exports = {
	"*.{js,ts}": () => [
		"yarn format",
		"yarn typecheck",
		"yarn test -- --only-changed",
	],
	"*.sh": "shellcheck",
};
