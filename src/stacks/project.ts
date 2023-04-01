import type { StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";
import { BaseStack } from "src/lib/base-stack";

/**
 * The stack that defines the resources for the project.
 */
export class MyProjectStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Change this to suit your project.
    new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      encryption: TableEncryption.CUSTOMER_MANAGED,
    });
  }
}
