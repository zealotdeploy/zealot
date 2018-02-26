const aws = require.requireActual("aws-sdk");

export const CFMocks = {
  deleteStackPromise: jest.fn(() => "promiseVal"),
  deleteStack: jest.fn(() => ({
    promise: CFMocks.deleteStackPromise,
  })),
};

export const CloudFormation = jest.fn(() => ({
  deleteStack: CFMocks.deleteStack,
}));

export default aws;
