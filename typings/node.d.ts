declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    // Add any environment variable that is expected to be defined
    AWS_REGION: string;
    CDK_DEFAULT_ACCOUNT: string;
    CDK_DEFAULT_REGION: string;
    GITHUB_SHA: string;
    NAG: string;
  }
}
