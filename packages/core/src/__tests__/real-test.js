import getStackOutputs from "../getStackOutputs";
import config from "../config";

jest.unmock("aws-sdk");
jest.unmock("../config");

describe("", () => {
  test("", async () => {
    console.log("config", config);
    /*
     * 1. Build and Deploy Docker Images
     * 2. Generates Task CFN
     * 3. Deploy CFN
     */
    console.log(await getStackOutputs("Zealot"));
  });
});
