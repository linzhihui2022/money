import { userPool, userPoolClient } from "./cognito";
import { categoryDB, accountDB, billDB, foodDB } from "./db";

export const api = new sst.aws.ApiGatewayV2("api", {
  cors: false,
  domain: {
    name: `${$app.stage.replace("be-", "")}.api.${process.env.DOMAIN}`,
  },
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
  handler: "src/user.login",
  link: [userPoolClient],
});
api.route("POST /user/refresh", {
  handler: "src/user.refresh",
  link: [userPoolClient],
});

api.route(
  "GET /category",
  { handler: "src/category.list", link: [categoryDB] },
  jwt,
);
api.route(
  "GET /category/{id}",
  { handler: "src/category.get", link: [categoryDB] },
  jwt,
);
api.route(
  "PUT /category/{id}/text",
  { handler: "src/category.updateText", link: [categoryDB] },
  jwt,
);
api.route(
  "DELETE /category/{id}",
  { handler: "src/category.del", link: [categoryDB] },
  jwt,
);
api.route(
  "POST /category",
  { handler: "src/category.add", link: [categoryDB] },
  jwt,
);

api.route(
  "GET /accounts",
  { handler: "src/account.list", link: [accountDB] },
  jwt,
);
api.route(
  "GET /account/{id}",
  { handler: "src/account.get", link: [accountDB] },
  jwt,
);
api.route(
  "POST /account",
  { handler: "src/account.add", link: [accountDB] },
  jwt,
);
api.route(
  "PUT /account/{id}/name",
  { handler: "src/account.updateName", link: [accountDB] },
  jwt,
);
api.route(
  "PUT /account/{id}/value",
  { handler: "src/account.updateValue", link: [accountDB] },
  jwt,
);
api.route(
  "DELETE /account/{id}",
  { handler: "src/account.del", link: [accountDB] },
  jwt,
);

api.route("POST /bill", { handler: "src/bill.add", link: [billDB] }, jwt);
api.route("GET /bills", { handler: "src/bill.list", link: [billDB] }, jwt);
api.route("GET /bill/{id}", { handler: "src/bill.get", link: [billDB] }, jwt);
api.route(
  "PUT /bill/{id}/desc",
  { handler: "src/bill.updateDesc", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/value",
  { handler: "src/bill.updateValue", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/account",
  { handler: "src/bill.updateAccount", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/category",
  { handler: "src/bill.updateCategory", link: [billDB] },
  jwt,
);
api.route(
  "PUT /bill/{id}/date",
  { handler: "src/bill.updateDate", link: [billDB] },
  jwt,
);
api.route(
  "DELETE /bill/{id}",
  { handler: "src/bill.del", link: [billDB] },
  jwt,
);

api.route("GET /foods", { handler: "src/food.list", link: [foodDB] }, jwt);
api.route("POST /food", { handler: "src/food.add", link: [foodDB] }, jwt);
api.route(
  `PUT /food/{id}/name`,
  { handler: "src/food.updateName", link: [foodDB] },
  jwt,
);
api.route(
  `PUT /food/{id}/type`,
  { handler: "src/food.updateType", link: [foodDB] },
  jwt,
);
api.route(
  `PUT /food/{id}/image`,
  { handler: "src/food.updateImage", link: [foodDB] },
  jwt,
);
api.route(
  "DELETE /food/{id}",
  { handler: "src/food.del", link: [foodDB] },
  jwt,
);
