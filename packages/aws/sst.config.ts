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
    const importBucket = new sst.aws.Bucket("importBucket");
    const billDB = new sst.aws.Dynamo("billDB", {
      fields: { id: "string", date: "number", active: "string" },
      primaryIndex: { hashKey: "id" },
      globalIndexes: { active: { hashKey: "active", rangeKey: "date" } },
      stream: "new-and-old-images",
      transform: { table: { pointInTimeRecovery: { enabled: false } } },
    });
    const accountDB = new sst.aws.Dynamo("accountDB", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
      transform: { table: { pointInTimeRecovery: { enabled: false } } },
    });
    const categoryDB = new sst.aws.Dynamo("categoryDB", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
      transform: { table: { pointInTimeRecovery: { enabled: false } } },
    });
    importBucket.subscribe(
      {
        handler: "src/bucket._import",
        link: [importBucket, accountDB, categoryDB, billDB],
      },
      { filterSuffix: ".import.csv", events: ["s3:ObjectCreated:*"] },
    );
    billDB.subscribe("updateAccount", {
      handler: "src/bill.subscribe",
      link: [accountDB, billDB, categoryDB],
    });

    const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
      mfa: "optional",
      triggers: { preSignUp: "src/cognito.triggers" },
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
    const api = new sst.aws.ApiGatewayV2("api", {
      cors: false,
      domain: { name: `${$app.stage}.linzhihui.app` },
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
    api.route(
      "GET /bill/{id}",
      { handler: "src/bill.get", link: [billDB] },
      jwt,
    );
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

    const web = new sst.aws.Nextjs("MyWeb", {
      path: "../web",
      environment: { API: api.url },
      domain: { name: `${$app.stage}-money.linzhihui.app` },
    });

    return {
      userPool: userPool.id,
      userPoolClient: userPoolClient.id,

      billDB: billDB.arn,
      accountDB: accountDB.arn,
      categoryDB: categoryDB.arn,
      web: web.url,
    };
  },
});
