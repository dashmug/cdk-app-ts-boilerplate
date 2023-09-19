module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "airbnb-typescript/base",
    "plugin:n/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "plugin:security/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
  },
  plugins: [
    "@typescript-eslint",
    "promise",
    "sonarjs",
    "unicorn",
    "import",
    "security",
  ],
  reportUnusedDisableDirectives: true,
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "no-new": "off",
    "no-restricted-syntax": "off",
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src",
            from: "./bin",
            message: 'Main code should not import from "bin/*".',
          },
        ],
      },
    ],
    "import/prefer-default-export": "off",
    // https://github.com/eslint-community/eslint-plugin-n/issues/84
    "n/no-missing-import": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          // "props" is very common in CDK code
          props: {
            properties: false,
          },
        },
      },
    ],
  },
  overrides: [
    {
      files: ["src/stacks/**/*.ts"],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "MemberExpression[object.name='process'][property.name='env']",
            message:
              "Usage of environment variables are not allowed inside Stacks. Pass them as StackProps instead from `./bin/app.ts`.",
          },
        ],
      },
    },
    {
      files: ["**/__tests__/**/*.test.ts"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/expect-expect": "off",
        "sonarjs/no-duplicate-string": "off",
      },
    },
    {
      files: ["**/*.js"],
      rules: {
        "unicorn/prefer-module": "off",
      },
    },
  ],
};
