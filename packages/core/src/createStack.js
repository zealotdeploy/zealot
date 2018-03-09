import { CloudFormation } from "aws-sdk";
import template from "./cf";
import zealotConfig from "./config";

const cf = new CloudFormation({
  apiVersion: "2010-05-15",
  region: zealotConfig.region,
});

export default async (stackName, opts = {}) => {
  const config = {
    ...zealotConfig,
    ...opts,
  };
  const parameters = [
    {
      ParameterKey: "ECSALB",
      ParameterValue: config.ECSALBARN,
    },
    {
      ParameterKey: "HOST",
      ParameterValue: config.domain,
    },
    {
      ParameterKey: "ALBLISTENER",
      ParameterValue:
        "arn:aws:elasticloadbalancing:us-east-2:763123831132:listener/app/ECSALB/d0bdeab7a8e77fa7/6ac5d09ed4da55e0",
    },
    {
      ParameterKey: "ALBPRIORITY",
      ParameterValue: "1",
    },
    {
      ParameterKey: "HEALTHCHECKPATH",
      ParameterValue: "/",
    },
    {
      ParameterKey: "ECSCLUSTER",
      ParameterValue: config.ecscluster,
    },
    {
      ParameterKey: "TASKDEFINITION",
      ParameterValue: config.taskDefinition,
    },
    {
      ParameterKey: "VPCID",
      ParameterValue: config.VPC,
    },
    {
      ParameterKey: "ECSServiceRole",
      ParameterValue: config.ECSServiceRole,
    },
    {
      ParameterKey: "CONTAINERNAME",
      ParameterValue: "app",
    },
  ];
  const req = cf.createStack({
    StackName: stackName,
    Parameters: parameters,
    TemplateBody: JSON.stringify(template),
  });

  try {
    const res = await req.promise();

    return res;
  } catch (e) {
    throw Error(e.message);
  }
};
