import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { MyProjectStack } from "src/stacks/project";

describe("MyProjectStack", () => {
  const app = new App();
  const stack = new MyProjectStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  it("matches the default snapshot", () => {
    expect(template).toMatchSnapshot();
  });
});
