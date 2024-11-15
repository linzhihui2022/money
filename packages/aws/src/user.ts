import { gatewayMiddleware } from "../lambda/APIGateway.ts";
import { BadRequestError, UnauthorizedError } from "../lambda/exceptions.ts";
import { Resource } from "sst";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient();
export const login = gatewayMiddleware<{ body: { username: string; password: string } }, { token: string; refreshToken?: string } | undefined>(
  async ({ parseEvent, assert, throwErrorIf }) => {
    const body = parseEvent();
    const username = assert(body.username, new BadRequestError("No username"));
    const password = assert(body.password, new BadRequestError("No password"));
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: Resource.Web.id,
      AuthParameters: { USERNAME: username, PASSWORD: password },
    });
    const res = await cognitoClient.send(command);
    if (res?.AuthenticationResult?.AccessToken) {
      return {
        token: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    }
    throwErrorIf(new UnauthorizedError("login fail"));
  },
);
