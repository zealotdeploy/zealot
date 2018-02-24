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

  try {
    const res = await req.promise();
    return res;
  } catch (e) {
    throw Error(e.message);
  }
};
