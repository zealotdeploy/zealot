import { ECS } from "aws-sdk";
import zealotConfig from "./config";
import getRepositoryUrl from "./getRepositoryUrl";
import computeImageName from "./computeImageName";

const registerTask = async (opts = {}) => {
  const config = {
    ...zealotConfig,
    ...opts,
  };

  const repositoryUrl = await getRepositoryUrl();

  const awslogConfiguration = prefix => ({
    logDriver: "awslogs",
    options: {
      "awslogs-group": config.logGroup,
      "awslogs-region": config.region,
      "awslogs-stream-prefix": prefix,
    },
  });

  const portMappings = port => [
    {
      containerPort: port,
      hostPort: 0,
    },
  ];

  const generateTaskDefinitionsFromConfig = task => ({
    name: task.name,
    image: `${repositoryUrl}/${computeImageName(task)}`,
    logConfiguration: task.logs ? awslogConfiguration(task.name) : null, // default
    memoryReservation: task.memoryReservation ? task.memoryReservation : 5,
    portMappings: task.default ? portMappings(config.port) : null,
    essential: task.essential !== "undefined" ? task.essential : true,
  });

  const containerDefinitions = config.tasks.map(
    generateTaskDefinitionsFromConfig,
  );

  const params = {
    containerDefinitions,
    family: config.slug,
  };

  const ecs = new ECS({
    region: config.region,
  });

  const req = await ecs.registerTaskDefinition(params);
  return req.promise();
};
export default registerTask;
