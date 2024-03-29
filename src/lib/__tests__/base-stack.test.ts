import { App, type StackProps } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Queue } from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";
import { BaseStack } from "src/lib/base-stack";

class TestStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "Bucket");
    new Queue(this, "Queue");
  }
}

describe("BaseStack", () => {
  const app = new App();
  const stack = new TestStack(app, "TestStack");
  const template = Template.fromStack(stack);

  it("adds the correct resource tags", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      Tags: [
        {
          Key: "myorg:application:description",
          Value: "Opinionated CDK Typescript Boilerplate",
        },
        {
          Key: "myorg:application:environment",
          Value: "prod",
        },
        {
          Key: "myorg:application:name",
          Value: "cdk-app-ts-boilerplate",
        },
        {
          Key: "myorg:application:repository",
          Value: "https://github.com/dashmug/cdk-app-ts-boilerplate",
        },
        {
          Key: "myorg:project:customer",
          Value: "myclient",
        },
        {
          Key: "myorg:project:name",
          Value: "myproject",
        },
        {
          Key: "myorg:project:owner",
          Value: "myteam",
        },
        {
          Key: "myorg:stack:name",
          Value: "TestStack",
        },
      ],
    });
  });

  it("generates an expected CloudFormation template", () => {
    expect(template).toMatchSnapshot();
  });
});
