import getAccountId from "./getAccountId";
import config from "./config";

const getRepositoryUrl = async task => {
  const accountId = await getAccountId();
  return `${accountId}.dkr.ecr.${config.region}.amazonaws.com`;
};

export default getRepositoryUrl;
