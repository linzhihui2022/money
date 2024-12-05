// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    if (!input?.stage?.startsWith("be-")) {
      throw new Error(`Invalid stage, stage should start with "be-"`);
    }
    return {
      name: "sst",
      removal: input?.stage === "be-production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { profile: process.env.AWS_PROFILE, region: "ap-southeast-1" },
      },
    };
  },
  async run() {
    const db = await import("./infra/db");
    const importBucket = await import("./infra/import");
    const cognito = await import("./infra/cognito");
    const api = await import("./infra/api");
    return {
      bill: db.billDB.arn,
      account: db.accountDB.arn,
      category: db.categoryDB.arn,
      importBucket: importBucket.importBucket.arn,
      cognitoClient: cognito.userPoolClient.id,
      api: api.api.url,
    };
  },
});
