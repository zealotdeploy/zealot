import { Docker } from "node-docker-api";
import tar from "tar-fs";

import promisifyStream from "./promisifyStream";
import inDockerIgnore from "./inDockerIgnore";

export default async tag => {
  const docker = new Docker();

  const fileStream = tar.pack("./", {
    ignore: inDockerIgnore,
  });
  const stream = await docker.image.build(fileStream, {
    t: tag,
  });

  await promisifyStream(stream);

  const image = await docker.image.get(tag).status();

  return image;
};
