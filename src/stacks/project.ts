import type { StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";
import { BaseStack } from "src/lib/base-stack";

export class MyProjectStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      encryption: TableEncryption.CUSTOMER_MANAGED,
    });
  }
}
