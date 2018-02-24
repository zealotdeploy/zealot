import { Docker } from "node-docker-api";
import tar from "tar-fs";

import promisifyStream from "./promisifyStream";
import inDockerIgnore from "./inDockerIgnore";

export default async tag => {
  const docker = new Docker();

  const fileStream = tar.pack("./", {
    ignore: inDockerIgnore,
  });

  try {
    const stream = await docker.image.build(fileStream, {
      t: tag,
    });

    await promisifyStream(stream);

    return await docker.image.get(tag).status();
  } catch (e) {
    throw Error(e.message);
  }
};
