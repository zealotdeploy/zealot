import { CloudFormation } from "aws-sdk";
import config from "./config";

const cf = new CloudFormation({
  apiVersion: "2010-05-15",
  region: config.region,
});

export default async stackName => {
  const req = cf.describeStacks({
    StackName: stackName,
  });

  try {
    const res = await req.promise();
    const outputs = {};
    res.Stacks[0].Outputs.forEach(output => {
      outputs[output.OutputKey] = output.OutputValue;
    });
    return outputs;
  } catch (e) {
    throw Error(e.message);
  }
};
