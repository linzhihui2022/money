import { fromIni } from "@aws-sdk/credential-providers";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const users = [
  { Email: "linzhihui2022+aws_test_1@outlook.com", Username: "aws_test_1" },
  { Email: "linzhihui2022+aws_test_2@outlook.com", Username: "aws_test_2" },
];

const credentials = fromIni({ profile: process.env.AWS_PROFILE });

const cognitoClient = new CognitoIdentityProviderClient({
  region: "ap-southeast-1",
  credentials,
});

const setupCognito = async () => {
  for (const user of users) {
    const { Username, Email } = user;
    await cognitoClient.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username,
        UserAttributes: [{ Name: "email", Value: Email }],
        Password: process.env.PASSWORD,
      }),
    );
  }
};
setupCognito();
