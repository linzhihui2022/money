import { gatewayMiddleware } from "../lambda/APIGateway.ts";
import { UnauthorizedError } from "../lambda/exceptions.ts";
import { Resource } from "sst";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AUTH, loginSchema, refreshSchema } from "types";
import { z } from "zod";

const cognitoClient = new CognitoIdentityProviderClient();
export const login = gatewayMiddleware<
  { body: z.infer<ReturnType<typeof loginSchema>> },
  | { token: string; refreshToken?: string; expiresIn: number | undefined }
  | undefined
>(async ({ throwErrorIf, validate }) => {
  const { username, password } = validate(loginSchema);
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: Resource.Web.id,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });
  try {
    const res = await cognitoClient.send(command);
    if (res?.AuthenticationResult?.AccessToken) {
      return {
        expiresIn: res.AuthenticationResult.ExpiresIn,
        token: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    }
  } catch (e) {
    throwErrorIf(new UnauthorizedError((e as Error).message, AUTH.LOGIN_FAIL));
  }
});

export const refresh = gatewayMiddleware<
  { body: z.infer<ReturnType<typeof refreshSchema>> },
  | { token: string; refreshToken?: string; expiresIn: number | undefined }
  | undefined
>(async ({ validate, throwErrorIf }) => {
  const { token } = validate(refreshSchema);
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: Resource.Web.id,
    AuthParameters: { REFRESH_TOKEN: token },
  });
  try {
    const res = await cognitoClient.send(command);
    if (res?.AuthenticationResult?.AccessToken) {
      return {
        expiresIn: res.AuthenticationResult.ExpiresIn,
        token: res.AuthenticationResult.AccessToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      };
    }
  } catch (e) {
    throwErrorIf(
      new UnauthorizedError((e as Error).message, AUTH.REFRESH_FAIL),
    );
  }
});
