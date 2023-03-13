module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "airbnb-typescript/base",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:sonarjs/recommended",
    "plugin:security/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "promise",
    "sonarjs",
    "security",
    "unicorn",
    "import",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "no-new": "off",
    "no-restricted-syntax": "off",
    "import/no-default-export": "error",
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src",
            from: "./bin",
            message: 'Main code should not import from "bin/*".',
          },
          {
            target: "./test",
            from: "./bin",
            message: 'Tests should not import from "bin/*".',
          },
        ],
      },
    ],
    "import/prefer-default-export": "off",
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
      files: ["test/**/*.ts"],
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
