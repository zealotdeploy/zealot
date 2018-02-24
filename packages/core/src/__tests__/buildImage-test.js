import { __setDockerMethods } from "node-docker-api";
import tar from "tar-fs";
import buildImage from "../buildImage";

jest.mock("../inDockerIgnore", () => "dockerIgnoreFunc");
jest.mock("../promisifyStream");
jest.mock("node-docker-api");
jest.mock("tar-fs");
//jest.unmock("node-docker-api");

const buildMock = jest.fn();

__setDockerMethods({
  image: {
    build: buildMock,
    get: jest.fn(() => ({
      status: jest.fn,
    })),
  },
});

describe("buildImage", () => {
  test("tars current directory with correct ignore func", async () => {
    await buildImage("testimg");

    expect.assertions(2);
    expect(tar.pack.mock.calls[0]).toEqual([
      "./",
      {
        ignore: "dockerIgnoreFunc",
      },
    ]);
    expect(buildMock.mock.calls[0]).toEqual([
      "PackVal",
      {
        t: "testimg",
      },
    ]);
  });
});
