jest.mock("cosmiconfig");

const realNow = Date.now;

describe("config", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => "currenttimestamp");
  });
  afterAll(() => {
    Date.now = realNow;
  });

  test("has current timestamp", () => {
    /* eslint-disable global-require */
    const config = require("../config").default;
    expect(config).toEqual({
      timestamp: "currenttimestamp",
    });
  });
});
