import { Docker } from "node-docker-api";
import getAuthorizationToken from "./getAuthorizationToken";
import promisifyStream from "./promisifyStream";

const docker = new Docker();

export default async tag => {
  const key = await getAuthorizationToken();

  /* eslint-disable-next-line */
  const authArr = atob(key).split(":");
  const auth = {
    username: authArr[0],
    password: authArr[1],
  };

  try {
    const testImage = await docker.image.get(tag);
    const result = await testImage.push(auth);
    await promisifyStream(result);
  } catch (e) {
    throw Error(e.message);
  }
};
