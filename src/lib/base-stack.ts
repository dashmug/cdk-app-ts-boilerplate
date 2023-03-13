import { Stack, StackProps, Tags } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as packageInfo from "../../package.json";

/**
 * A base stack class with preset environment and tags.
 */
export abstract class BaseStack extends Stack {
  protected constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
      ...props,
    });

    Tags.of(this).add("Application", packageInfo.name);

    if (packageInfo.description) {
      Tags.of(this).add("Description", packageInfo.description);
    }

    if (packageInfo.repository) {
      Tags.of(this).add("Repository", packageInfo.repository);
    }

    Tags.of(this).add("Stack", id);
  }
}
