import { CloudFormation } from "aws-sdk";
import config from "./config";

const cf = new CloudFormation({
  apiVersion: "2010-05-15",
  region: config.region,
});

export default async stackName => {
  const req = cf.deleteStack({
    StackName: stackName,
  });

  return req.promise();
};
