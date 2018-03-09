#!/usr/bin/env node
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@zealotdeploy/core')) :
	typeof define === 'function' && define.amd ? define(['@zealotdeploy/core'], factory) :
	(factory(global.core));
}(this, (function (core) { 'use strict';

const outputs = async () => {
  const stackConfig = await core.getStackOutputs(core.config.stackName);
  const registryExists = await core.checkRegistry();
  if (!registryExists) {
    await core.createRegistry();
  }

  const createTasks = core.config.tasks.map(async task => {
    const accountId = await core.getAccountId();
    const tag = core.computeImageName(task);
    const tagDomain = `${accountId}.dkr.ecr.${core.config.region}.amazonaws.com`;
    const fullTag = `${tagDomain}/${tag}`;

    await core.buildImage(fullTag);
    await core.pushImage(fullTag);
  });

  Promise.all(createTasks).then(async () => {
    console.log("Stack", stackConfig);
    console.log("Registering task");
    const registration = await core.registerTask({
      logGroup: stackConfig.CloudwatchLogsGroup,
    });

    const { taskDefinitionArn } = registration.taskDefinition;

    stackConfig.taskDefinition = taskDefinitionArn;
    await core.createStack("random", stackConfig);
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

})));
