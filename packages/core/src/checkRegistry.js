import { ECR } from "aws-sdk";
import config from "./config";

const ecr = new ECR({ region: config.region });

export default async () => {
  try {
    const params = {
      repositoryNames: [config.slug],
    };
    const req = ecr.describeRepositories(params);
    await req.promise();
    return true;
  } catch (e) {
    return false;
  }
};
