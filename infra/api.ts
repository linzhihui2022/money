import { userPool, userPoolClient } from "./cognito";
import { categoryDB, accountDB, billDB } from "./db";

export const api = new sst.aws.ApiGatewayV2("api", {
  cors: false,
  domain: { name: `${$app.stage}.${process.env.DOMAIN}` },
});
const auth = api.addAuthorizer({
  name: "auth",
  jwt: {
    audiences: [userPoolClient.id],
    issuer: $interpolate`https://cognito-idp.ap-southeast-1.amazonaws.com/${userPool.id}`,
  },
});
const jwt = { auth: { jwt: { authorizer: auth.id } } };

api.route("POST /user", {
  handler: "packages/aws/src/user.login",
  link: [userPoolClient],
});
api.route("POST /user/refresh", {
  handler: "packages/aws/src/user.refresh",
  link: [userPoolClient],
});

api.route(
  "GET /category",
  { handler: "packages/aws/src/category.list", link: [categoryDB] },
  jwt,
);
api.route(
  "GET /category/{id}",
  { handler: "packages/aws/src/category.get", link: [categoryDB] },
  jwt,
);
api.route(
  "PUT /category/{id}/text",
  { handler: "packages/aws/src/category.updateText", link: [categoryDB] },
  jwt,
);
api.route(
  "DELETE /category/{id}",
  { handler: "packages/aws/src/category.del", link: [categoryDB] },
  jwt,
);
api.route(
  "POST /category",
  { handler: "packages/aws/src/category.add", link: [categoryDB] },
  jwt,
);

api.route(
  "GET /accounts",
  { handler: "packages/aws/src/account.list", link: [accountDB] },
  jwt,
);
api.route(
  "GET /account/{id}",
  { handler: "packages/aws/src/account.get", link: [accountDB] },
  jwt,
);
api.route(
  "POST /account",
  { handler: "packages/aws/src/account.add", link: [accountDB] },
  jwt,
);
api.route(
  "PUT /account/{id}/name",
  { handler: "packages/aws/src/account.updateName", link: [accountDB] },
  jwt,
);
api.route(
  "PUT /account/{id}/value",
  { handler: "packages/aws/src/account.updateValue", link: [accountDB] },
  jwt,
);
api.route(
  "DELETE /account/{id}",
  { handler: "packages/aws/src/account.del", link: [accountDB] },
  jwt,
);

api.route(
  "POST /bill",
  { handler: "packages/aws/src/bill.add", link: [billDB] },
  jwt,
);
api.route(
  "GET /bills",
  { handler: "packages/aws/src/bill.list", link: [billDB] },
  jwt,
);
api.route(
  "GET /bill/{id}",
  { handler: "packages/aws/src/bill.get", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/desc",
  { handler: "packages/aws/src/bill.updateDesc", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/value",
  { handler: "packages/aws/src/bill.updateValue", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/account",
  { handler: "packages/aws/src/bill.updateAccount", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/category",
  { handler: "packages/aws/src/bill.updateCategory", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/date",
  { handler: "packages/aws/src/bill.updateDate", link: [billDB] },
  jwt,
);
api.route(
  "DELETE /bill/{id}",
  { handler: "packages/aws/src/bill.del", link: [billDB] },
  jwt,
);
