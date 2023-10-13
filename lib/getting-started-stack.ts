import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { NodejsFunction, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class GettingStartedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const rule = this.createEventBridgeSchedule();
    const lambdaFunction = this.notificationLambdaFunction();

    rule.addTarget(new LambdaFunction(lambdaFunction));
  }

  private createEventBridgeSchedule() {
    return new Rule(this, "BrushSchedule", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "6",
        day: "*",
        month: "*",
        year: "*",
      }),
    });
  }
  private notificationLambdaFunction(): NodejsFunction {
    const lambdaFunction = new NodejsFunction(
      this,
      "NotificationLambdaFunction",
      {
        entry: path.join(__dirname, "lambda", "brush_your_teeth", "index.ts"),
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(30),
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: SourceMapMode.INLINE,
          externalModules: ["@aws-sdk/*"],
        },
      },
    );

    lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        sid: "AllowSendingEmail",
        effect: Effect.ALLOW,
        actions: ["ses:SendRawEmail"],
        resources: ["*"],
      }),
    );

    return lambdaFunction;
  }
}
