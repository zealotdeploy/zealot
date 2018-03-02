import { CloudFormation } from "aws-sdk";
import template from "./cf";
import config from "./config";

const cf = new CloudFormation({
  apiVersion: "2010-05-15",
  region: config.region,
});

export default async (stackName, params = {}) => {
  const req = cf.createStack({
    StackName: stackName,
    TemplateBody: JSON.stringify(template),
    ...params,
  });

  try {
    const res = await req.promise();

    return res;
  } catch (e) {
    throw Error(e.message);
  }
};
