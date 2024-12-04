export const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
  triggers: { preSignUp: "src/cognito.triggers" },
});
export const userPoolClient = userPool.addClient("Web", {
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

export const myIdentityPool = new sst.aws.CognitoIdentityPool(
  "MyIdentityPool",
  {
    userPools: [{ userPool: userPool.id, client: userPoolClient.id }],
  },
);
