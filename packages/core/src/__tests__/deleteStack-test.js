import { CloudFormation as MockCloudFormation, CFMocks } from "aws-sdk";
import deleteStack from "../deleteStack";

jest.mock("aws-sdk");
jest.mock("../config");

describe("deleteStack", () => {
  afterAll(() => {
    MockCloudFormation.mockReset();
    CFMocks.deleteStack.mockReset();
    CFMocks.deleteStackPromise.mockReset();
  });

  test("deploys", async () => {
    const result = await deleteStack("stackName");

    expect.assertions(2);
    expect(result).toEqual("promiseVal");
    expect(MockCloudFormation.mock.calls[0]).toEqual([
      {
        apiVersion: "2010-05-15",
        region: "currentRegion",
      },
    ]);
  });
});
