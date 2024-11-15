import { cognitoMiddleware } from "../lambda/Trigger.ts";
import type { PreSignUpEmailTriggerEvent } from "aws-lambda";

export const triggers = cognitoMiddleware<PreSignUpEmailTriggerEvent>(async ({ event }) => {
  const triggerSource = event.triggerSource;
  switch (triggerSource) {
    case "PreSignUp_SignUp": {
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
      return event;
    }
    default:
      throw new Error(`Misconfigured Cognito Trigger ${event}`);
  }
});
