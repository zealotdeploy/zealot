/* eslint-disable no-underscore-dangle */
import fs from "fs";
import { isFileIgnored, getDockerIgnoresFromFile } from "../inDockerIgnore";

jest.mock("fs");

describe("inDockerIgnore", () => {
  test("returns empty array when .dockerignore doesn't exist", () => {
    expect(getDockerIgnoresFromFile()).toEqual([]);
  });

  describe("when .dockerignore file exists", () => {
    beforeAll(() => {
      fs.__setMockFiles({
        "./.dockerignore": "test.js\nanother",
      });
    });

    test("returns contents as an array", () => {
      expect(getDockerIgnoresFromFile()).toEqual(["test.js", "another"]);
    });
  });

  describe("isFileIgnore", () => {
    test("returns false when file not in list", () => {
      expect(isFileIgnored(["another"], "test.js")).toEqual(false);
    });
    test("returns false when list is empty", () => {
      expect(isFileIgnored([], "test.js")).toEqual(false);
    });
    test("returns true when file is in list", () => {
      expect(isFileIgnored(["test.js", "another"], "test.js")).toEqual(true);
    });
  });
});
