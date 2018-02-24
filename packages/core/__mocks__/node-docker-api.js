/* eslint-disable no-underscore-dangle */
let inner = {};

export function __setDockerMethods(methods) {
  inner = methods;
}

export class Docker {
  constructor() {
    return inner;
  }
}
