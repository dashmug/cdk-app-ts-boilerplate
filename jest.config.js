module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["lcov", "text"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
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
  },
};
