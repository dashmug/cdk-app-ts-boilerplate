declare namespace NodeJS {
	interface ProcessEnv {
		// Add any environment variable that is expected to be defined
		AWS_REGION: string;
		CDK_DEFAULT_ACCOUNT: string;
		CDK_DEFAULT_REGION: string;
		NAG: string;
	}
}
