import { App, StackProps } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Bucket } from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";
import { BaseStack } from "src/lib/base-stack";

class TestStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "Bucket");
  }
}

describe("BaseStack", () => {
  const app = new App();
  const stack = new TestStack(app, "TestStack");
  const template = Template.fromStack(stack);

  it("adds resource tags based on package.json values", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      Tags: [
        {
          Key: "Application",
          Value: "cdk-boilerplate",
        },
        {
          Key: "Description",
          Value: "Opinionated CDK Typescript Boilerplate",
        },
        {
          Key: "Repository",
          Value: "https://github.com/dashmug/cdk-typescript-boilerplate",
        },
        {
          Key: "Stack",
          Value: "TestStack",
        },
      ],
    });
  });
});
