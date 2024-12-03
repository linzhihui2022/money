// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { profile: process.env.AWS_PROFILE, region: "ap-southeast-1" },
      },
    };
  },
  async run() {
    await import("./infra/db");
    await import("./infra/import");
    await import("./infra/cognito");
    await import("./infra/api");
    await import("./infra/next");
  },
});
