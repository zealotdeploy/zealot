import { STS } from "aws-sdk";
import config from "./config";

const sts = new STS({
  apiVersion: "2011-06-15",
  region: config.region,
});

export default async () => {
  const req = sts.getCallerIdentity({});

  try {
    const res = await req.promise();

    return res.Account;
  } catch (e) {
    throw Error(e.message);
  }
};
