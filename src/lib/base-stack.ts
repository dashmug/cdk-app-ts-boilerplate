import { Stack, StackProps, Tags } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as packageInfo from "package.json";

/**
 * A base stack class with preset environment and resource tags that are
 * applied to all taggable resources in the stack.
 */
export abstract class BaseStack extends Stack {
  // Rename this to your organization name. This makes it easy to see
  // your own tags vs. AWS-generated tags.
  private tagPrefix = "myorg";

  protected constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
      ...props,
    });

    // Have a read through "Tagging AWS Resources"
    // (https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
    // and decide on a tagging strategy that works for you. A few tags
    // are included here to get you started.
    const tags = {
      "application:name": packageInfo.name,
      "application:description": packageInfo.description,
      "application:repository": packageInfo.repository,
      "application:environment": "prod",
      "project:name": "myproject",
      "project:owner": "myteam",
      "project:customer": "myclient",
      "stack:name": this.stackName,
      "stack:description": props?.description,
    };

    for (const [key, value] of Object.entries(tags)) {
      if (value) {
        Tags.of(this).add(`${this.tagPrefix}:${key}`, value);
      }
    }
  }
}
