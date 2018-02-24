import { ECR } from "aws-sdk";
import config from "./config";

const ecr = new ECR({
  apiVersion: "2015-09-21",
  region: config.region,
});

export default async () => {
  const req = ecr.getAuthorizationToken();

  try {
    const res = await req.promise();

    return res.authorizationData[0].authorizationToken;
  } catch (e) {
    throw Error(e.message);
  }
};
