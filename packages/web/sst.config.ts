// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    if (!input?.stage?.startsWith("fe-")) {
      throw new Error(`Invalid stage, stage should start with "fe-"`);
    }
    return {
      name: "sst",
      removal: input?.stage === "fe-production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { profile: process.env.AWS_PROFILE, region: "ap-southeast-1" },
      },
    };
  },
  async run() {
    const web = new sst.aws.Nextjs("MyWeb", {
      environment: {
        API: `https://${$app.stage.replace("fe-", "")}.api.${process.env.DOMAIN}`,
      },
      domain: {
        name: `${$app.stage.replace("fe-", "")}.${process.env.DOMAIN}`,
      },
    });
    return {
      web: web.url,
    };
  },
});
