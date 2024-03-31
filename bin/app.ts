import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import {
  AwsSolutionsChecks,
  HIPAASecurityChecks,
  NIST80053R5Checks,
  PCIDSS321Checks,
} from "cdk-nag";
import { MyProjectStack } from "src/stacks/project";

const app = new cdk.App();

new MyProjectStack(app, "MyProject");

// Feel free to enable or disable the checks you want to run.
// More information about the rules can be found here:
// https://github.com/cdklabs/cdk-nag/blob/main/RULES.md
const checks = [
  // Check Best practices based on AWS Solutions Security Matrix
  new AwsSolutionsChecks({ verbose: true }),

  // Check for HIPAA Security compliance.
  // Based on the HIPAA Security AWS operational best practices:
  // https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-hipaa_security.html
  new HIPAASecurityChecks({ verbose: true }),

  // Check for PCI DSS 3.2.1 compliance.
  // Based on the PCI DSS 3.2.1 AWS operational best practices:
  // https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-pci-dss.html
  new PCIDSS321Checks({ verbose: true }),

  // Check for NIST 800-53 rev 5 compliance.
  // Based on the NIST 800-53 rev 5 AWS operational best practices:
  // https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-nist-800-53_rev_5.html
  new NIST80053R5Checks({ verbose: true }),
];

if (process.env.NAG) {
  for (const check of checks) {
    Aspects.of(app).add(check);
  }
}

app.synth();
