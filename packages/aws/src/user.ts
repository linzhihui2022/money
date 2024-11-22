import { gatewayMiddleware } from "../lambda/APIGateway.ts";
import { UnauthorizedError } from "../lambda/exceptions.ts";
import { Resource } from "sst";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { z } from "zod";

const cognitoClient = new CognitoIdentityProviderClient();
export const login = gatewayMiddleware<{ body: { username: string; password: string } }, { token: string; refreshToken?: string } | undefined>(
  async ({ parseEvent, throwErrorIf, validate }) => {
    const { username, password } = validate(() => z.object({ username: z.string(), password: z.string() }), parseEvent(), "data invalid");
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: Resource.Web.id,
      AuthParameters: { USERNAME: username, PASSWORD: password },
    });
    const res = await cognitoClient.send(command);
    if (res?.AuthenticationResult?.AccessToken) {
      return {
        expiresIn: res.AuthenticationResult.ExpiresIn,
        token: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    }
    throwErrorIf(new UnauthorizedError("login fail"));
  },
);

export const refresh = gatewayMiddleware(async ({ parseEvent, validate, throwErrorIf }) => {
  const { token } = validate(() => z.object({ token: z.string() }), parseEvent(), "data invalid");
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: Resource.Web.id,
    AuthParameters: { REFRESH_TOKEN: token },
  });
  const res = await cognitoClient.send(command);
  if (res?.AuthenticationResult?.AccessToken) {
    return {
      expiresIn: res.AuthenticationResult.ExpiresIn,
      token: res.AuthenticationResult.AccessToken,
      refreshToken: res.AuthenticationResult.RefreshToken,
    };
  }
  throwErrorIf(new UnauthorizedError("refresh fail"));
});
