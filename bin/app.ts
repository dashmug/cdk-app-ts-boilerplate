#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { MyProjectStack } from "src/stacks/project";

const app = new cdk.App();

new MyProjectStack(app, "MyProject");

Aspects.of(app).add(new AwsSolutionsChecks());

app.synth();
