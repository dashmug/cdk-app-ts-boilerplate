module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["lcov", "text"],
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^bin/(.*)$": "<rootDir>/bin/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1",
  },
};
