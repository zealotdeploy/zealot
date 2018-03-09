import { ECR } from "aws-sdk";
import config from "./config";

const ecr = new ECR({ region: config.region });

export default async () => {
  const params = {
    repositoryName: config.slug,
  };

  try {
    const req = ecr.createRepository(params);
    const res = await req.promise();
    return res;
  } catch (e) {
    throw Error(e.message);
  }
};
