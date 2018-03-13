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
        " arn:aws:elasticloadbalancing:us-east-2:545046381935:listener/app/ECSALB/cf566e0772d5d704/5b5d299a49d4beab",
    },
    {
      ParameterKey: "ALBPRIORITY",
      ParameterValue: "10",
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
