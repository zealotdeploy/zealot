import buildImage from "../buildImage";

describe("", () => {
  process.env = {
    ...process.env,
    AWS_ACCESS_KEY_ID: "",
    AWS_SECRET_ACCESS_KEY: "",
  };

  test("", async () => {
    /*
     * 1. Build and Deploy Docker Images
     * 2. Generates Task CFN
     * 3. Deploy CFN
     */
    await buildImage();
  });
});
