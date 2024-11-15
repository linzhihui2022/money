import type { Context, Handler } from "aws-lambda";
import { TriggerLoggerProxy } from "./logger.ts";
import { ThrowErrorIf } from "./APIGateway.ts";
import type { BaseTriggerEvent } from "aws-lambda/trigger/cognito-user-pool-trigger/_common";
import { TriggerError } from "./exceptions.ts";

const Assert =
  (logger: ReturnType<typeof TriggerLoggerProxy>) =>
  <Value>(condition: Value, error: Error) => {
    if (!condition) {
      logger.error({ message: error.message });
      throw new TriggerError(error.message);
    }
    return condition;
  };

export const cognitoMiddleware =
  <E extends BaseTriggerEvent<string>>(
    handler: (utils: {
      assert: <Value>(condition: Value, error: Error) => NonNullable<Value>;
      logger: ReturnType<typeof TriggerLoggerProxy>;
      throwErrorIf: (error?: Error) => void;
      event: E;
      context: Context;
    }) => Promise<E>,
  ): Handler<E> =>
  async (event, context, callback) => {
    const loggerProxy = TriggerLoggerProxy(event, context);
    const assert = Assert(loggerProxy);
    const throwErrorIf = ThrowErrorIf(loggerProxy);
    try {
      const resEvent = await handler({
        throwErrorIf,
        logger: loggerProxy,
        event,
        context,
        assert,
      });
      callback(null, resEvent);
    } catch (e) {
      const error = e as Error;
      loggerProxy.error({ error, success: false });
      callback(error);
    }
  };
