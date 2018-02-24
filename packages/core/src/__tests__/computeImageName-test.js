import computeImageName from "../computeImageName";

jest.mock("../config", () => ({
  slug: "slug",
  timestamp: "timestamp",
}));

describe("computeImageName", () => {
  test("generates correct image name", () => {
    const task = {
      name: "taskName",
    };
    expect(computeImageName(task)).toEqual("slug:taskName-timestamp");
  });
});
