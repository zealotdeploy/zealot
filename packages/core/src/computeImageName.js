import config from "./config";

const computeImageName = task =>
  `${config.slug}:${task.name}-${config.timestamp}`;

export default computeImageName;
