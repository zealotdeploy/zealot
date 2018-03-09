import {
  buildImage,
  computeImageName,
  config,
  deleteStack,
  createStack,
  createRegistry,
  checkRegistry,
  getAccountId,
  getAuthorizationToken,
  getStackOutputs,
  pushImage,
  registerTask,
} from "@zealotdeploy/core";

const outputs = async () => {
  const stackConfig = await getStackOutputs(config.stackName);
  const registryExists = await checkRegistry();
  if (!registryExists) {
    await createRegistry();
  }

  const createTasks = config.tasks.map(async task => {
    const accountId = await getAccountId();
    const tag = computeImageName(task);
    const tagDomain = `${accountId}.dkr.ecr.${config.region}.amazonaws.com`;
    const fullTag = `${tagDomain}/${tag}`;

    await buildImage(fullTag);
    await pushImage(fullTag);
  });

  Promise.all(createTasks).then(async () => {
    console.log("Stack", stackConfig);
    console.log("Registering task");
    const registration = await registerTask({
      logGroup: stackConfig.CloudwatchLogsGroup,
    });

    const { taskDefinitionArn } = registration.taskDefinition;

    stackConfig.taskDefinition = taskDefinitionArn;
    await createStack("random", stackConfig);
    throw "stop";
  });

  // On Every Build
  // * Build Image
  // * Push Image
  // * Register Task Definition
  // * Check for existence of Service (Create, Update)
  //
  // Create Service
  // * Creates CFN (Pass in Task Definition)
  //
  // Update Service
  // * Update Service to use the new Task Definition
  //
};

outputs();
