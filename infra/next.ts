import { api } from "./api";

export const web = new sst.aws.Nextjs("MyWeb", {
  path: "packages/web",
  environment: { API: api.url },
  domain: { name: `${$app.stage}-money.${process.env.DOMAIN}` },
});
