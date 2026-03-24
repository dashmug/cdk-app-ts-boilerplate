module.exports = {
	testEnvironment: "node",
	collectCoverageFrom: ["src/**/*.ts"],
	coverageReporters: ["lcov", "text"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				diagnostics: false,
			},
		],
	},
};
