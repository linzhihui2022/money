// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "lzh",
          region: "ap-southeast-1",
        },
      },
    };
  },
  async run() {
    const billDB = new sst.aws.Dynamo("billDB", {
      fields: {
        id: "string",
        date: "number",
        account: "string",
        category: "string",
        active: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        active: { hashKey: "active", rangeKey: "date" },
        account: { hashKey: "account", rangeKey: "date" },
        category: { hashKey: "category", rangeKey: "date" },
      },
    });
    const accountDB = new sst.aws.Dynamo("accountDB", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
    });

    const categoryDB = new sst.aws.Dynamo("categoryDB", {
      fields: { id: "string", pid: "string", value: "string" },
      primaryIndex: { hashKey: "id" },
      globalIndexes: { pid: { hashKey: "pid" }, value: { hashKey: "value" } },
    });
    const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
      mfa: "optional",
    });

    const userPoolClient = userPool.addClient("Web", {
      transform: {
        client: {
          enableTokenRevocation: true,
          explicitAuthFlows: [
            "ALLOW_USER_PASSWORD_AUTH",
            "ALLOW_REFRESH_TOKEN_AUTH",
          ],
        },
      },
    });

    new sst.aws.CognitoIdentityPool("MyIdentityPool", {
      userPools: [{ userPool: userPool.id, client: userPoolClient.id }],
    });
    const api = new sst.aws.ApiGatewayV2("api", { cors: false });
    const auth = api.addAuthorizer({
      name: "auth",
      jwt: {
        audiences: [userPoolClient.id],
        issuer: $interpolate`https://cognito-idp.ap-southeast-1.amazonaws.com/${userPool.id}`,
      },
    });

    api.route(
      "GET /category",
      { link: [categoryDB], handler: "category.list" },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "PUT /category/{id}/text",
      { link: [categoryDB], handler: "category.updateText" },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "PUT /category/{id}/parent",
      { link: [categoryDB], handler: "category.updateParent" },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "DELETE /category/{id}",
      { link: [categoryDB], handler: "category.del" },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "POST /category",
      { link: [categoryDB], handler: "category.add" },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route("POST /user", {
      handler: "user.login",
      link: [userPoolClient],
    });
    api.route("PUT /user/password/required", {
      handler: "user.newPasswordRequired",
      link: [userPoolClient],
    });

    api.route(
      "GET /accounts",
      { handler: "account.list", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "GET /account/{id}",
      { handler: "account.get", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "POST /account",
      { handler: "account.add", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "PUT /account/{id}/name",
      { handler: "account.updateName", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "PUT /account/{id}/value",
      { handler: "account.updateValue", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "DELETE /account/{id}",
      { handler: "account.del", link: [accountDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "POST /bill",
      { handler: "bill.add", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "GET /bills",
      { handler: "bill.list", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "GET /bill/{id}",
      { handler: "bill.get", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/desc",
      { handler: "bill.updateDesc", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/value",
      { handler: "bill.updateValue", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/account",
      { handler: "bill.updateAccount", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/category",
      { handler: "bill.updateCategory", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/date",
      { handler: "bill.updateDate", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );

    api.route(
      "PUT /bill/{id}/active",
      { handler: "bill.updateActive", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    api.route(
      "DELETE /bill/{id}",
      { handler: "bill.del", link: [billDB] },
      { auth: { jwt: { authorizer: auth.id } } },
    );
    return {
      api: api.url,
      userPool: userPool.id,
      userPoolClient: userPoolClient.id,

      billDB: billDB.arn,
      accountDB: accountDB.arn,
      categoryDB: categoryDB.arn,
    };
  },
});
