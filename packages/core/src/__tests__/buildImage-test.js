import { __setDockerMethods } from "node-docker-api";
import tar, { __packReturnVal } from "tar-fs";
import buildImage from "../buildImage";
import promisifyStream from "../promisifyStream";

jest.mock("../inDockerIgnore", () => "dockerIgnoreFunc");
jest.mock("../promisifyStream");
jest.mock("node-docker-api");
jest.mock("tar-fs");

const buildReturnVal = "buildReturnVal";

const buildMock = jest.fn(() => buildReturnVal);
const getStatusMock = jest.fn(() => "output");
const getMock = jest.fn(() => ({
  status: getStatusMock,
}));

__setDockerMethods({
  image: {
    build: buildMock,
    get: getMock,
  },
});

describe("buildImage", () => {
  test("Builds correctly", async () => {
    const imageName = "testimg";

    const returnVal = await buildImage(imageName);

    expect.assertions(5);

    /**
     * Ensure we receive the correct final value
     */
    expect(returnVal).toEqual("output");

    /**
     * Ensure the tar packs the current directory and uses the ignore function
     */
    expect(tar.pack.mock.calls[0]).toEqual([
      "./",
      {
        ignore: "dockerIgnoreFunc",
      },
    ]);

    /**
     * Ensure the build is triggered with the value from the tar pack and the
     * correct image name
     */
    expect(buildMock.mock.calls[0]).toEqual([
      __packReturnVal,
      {
        t: imageName,
      },
    ]);

    /**
     * Ensure the stream is read with the return value of the buildFunc
     */
    expect(promisifyStream.mock.calls[0]).toEqual([buildReturnVal]);

    /**
     * Ensure that after we finish our calls, we get the status of the image
     */
    expect(getStatusMock.mock.calls.length).toEqual(1);
  });
});
