import { gatewayMiddleware } from "./lambda/APIGateway.ts";
import { BadRequestError, UnauthorizedError } from "./lambda/exceptions.ts";
import { Resource } from "sst";
import {
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  type InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient();
export const login = gatewayMiddleware<
  { body: { username: string; password: string } },
  | {
      action: ChallengeNameType;
      session?: string;
    }
  | { token: string; refreshToken?: string }
  | undefined
>(async ({ parseEvent, assert, throwErrorIf }) => {
  const body = parseEvent();
  const username = assert(body.username, new BadRequestError("No username"));
  const password = assert(body.password, new BadRequestError("No password"));
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: Resource.Web.id,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });
  const res = await cognitoClient.send(command);
  if (res.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
    return {
      action: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      session: res.Session,
    };
  }
  if (res?.AuthenticationResult?.AccessToken) {
    return {
      token: res.AuthenticationResult.AccessToken,
      refreshToken: res.AuthenticationResult.RefreshToken,
    };
  }
  throwErrorIf(new UnauthorizedError("login fail"));
});

export const newPasswordRequired = gatewayMiddleware<
  { body: { username: string; password: string; session: string } },
  InitiateAuthCommandOutput | undefined
>(async ({ parseEvent, assert }) => {
  const data = parseEvent();
  const username = assert(data.username, new BadRequestError("No username"));
  const password = assert(data.password, new BadRequestError("No password"));
  const session = assert(data.session, new BadRequestError("No session"));
  const command = new RespondToAuthChallengeCommand({
    ClientId: Resource.Web.id,
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    Session: session,
    ChallengeResponses: { NEW_PASSWORD: password, USERNAME: username },
  });
  return await cognitoClient.send(command);
});
