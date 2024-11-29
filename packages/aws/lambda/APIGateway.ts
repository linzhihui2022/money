import { createLogger, LoggerProxy } from "./logger.ts";
import { BadRequestError, type StandardisedError } from "./exceptions.ts";
import { z, type ZodError } from "zod";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
} from "aws-lambda";
import { createErrorResponse, responseOk } from "./response.ts";
import { COMMON, type EmptyObj } from "types";

export const Assert =
  (logger: ReturnType<typeof LoggerProxy>) =>
  <Value>(condition: Value, error: StandardisedError) => {
    if (!condition) {
      logger.error({ message: error.message, status: error.statusCode });
      throw error;
    }
    return condition;
  };
export const Validate =
  (logger: ReturnType<typeof LoggerProxy>, parseData: () => unknown) =>
  <T extends z.Schema<unknown>>(schema: () => T, data?: unknown) => {
    try {
      return schema().parse(data || parseData());
    } catch (error) {
      const zodError = error as ZodError;
      logger.error({ zodError });
      throw new BadRequestError(zodError.message, COMMON.INVALID);
    }
  };

export const FindHeader = (
  headers: APIGatewayProxyEventV2["headers"],
  logger: ReturnType<typeof LoggerProxy>,
) => {
  return (rawKey: string) => {
    const header = Object.entries(headers).find(
      ([k]) => k.toLowerCase() === rawKey.toLowerCase(),
    );
    if (header) {
      const [key, value] = header;
      logger.debug({ rawKey, header: { key, value } });
      return value;
    }
    logger.debug({ rawKey, header });
    return;
  };
};
export const ParseEvent = <
  Body = unknown,
  Path = Record<string, string>,
  Query = Record<string, string>,
>(
  event: APIGatewayProxyEventV2,
  logger: ReturnType<typeof LoggerProxy>,
) => {
  return () => {
    let body: Partial<Body> = {};
    const path = (event.pathParameters || {}) as Partial<Path>;
    const query = (event.queryStringParameters || {}) as Partial<Query>;
    try {
      body = JSON.parse(event.body || "") as Partial<Body>;
      if (Array.isArray(body)) {
        body = { body } as unknown as Partial<Body>;
      }
    } catch {
      /* empty */
    }
    logger.debug({ body, path, query });
    return { ...body, ...path, ...query };
  };
};

export const ThrowErrorIf = (logger: ReturnType<typeof LoggerProxy>) => {
  return (error?: Error | StandardisedError) => {
    if (error) {
      logger.error({ error });
      throw error;
    }
  };
};
export const ResponseHeaders = () => {
  const headers: Record<string, string> = {};
  return {
    add: (key: string, value: string) => (headers[key] = value),
    remove: (key: string) => delete headers[key],
    output: () => headers,
  };
};
interface RequestData {
  body?: Record<string, unknown>;
  path?: Record<string, string>;
  query?: Record<string, unknown>;
}
export const gatewayMiddleware =
  <
    Data extends RequestData = {
      body: EmptyObj;
      path: EmptyObj;
      query: EmptyObj;
    },
    Response = void,
  >(
    handler: (utils: {
      assert: <Value, E = never>(
        condition: Value,
        error: StandardisedError,
      ) => NonNullable<Value>;
      parseEvent: () => Partial<Data["body"]> &
        Partial<Data["path"]> &
        Partial<Data["query"]>;
      logger: ReturnType<typeof createLogger>;
      throwErrorIf: (error?: Error) => void;
      headers: ReturnType<typeof ResponseHeaders>;
      event: APIGatewayProxyEventV2;
      context: Context;
      findHeader: ReturnType<typeof FindHeader>;
      validate: <T extends z.Schema<unknown>>(
        schema: () => T,
        data?: unknown,
      ) => z.infer<T>;
    }) => Promise<Response>,
  ): APIGatewayProxyHandlerV2 =>
  async (event, context) => {
    const loggerProxy = LoggerProxy(event, context);
    const assert = Assert(loggerProxy);
    const parseEvent = ParseEvent(event, loggerProxy);
    const throwErrorIf = ThrowErrorIf(loggerProxy);
    const headers = ResponseHeaders();
    const validate = Validate(loggerProxy, parseEvent);
    const findHeader = FindHeader(event.headers, loggerProxy);
    try {
      const res = await handler({
        throwErrorIf,
        assert,
        parseEvent,
        logger: loggerProxy,
        event,
        context,
        headers,
        validate,
        findHeader,
      });
      const responseHeaders = headers.output();
      const response = responseOk(res, responseHeaders);
      loggerProxy.debug({ response, responseHeaders, success: true });
      return response;
    } catch (e) {
      const error = e as StandardisedError;
      const response = createErrorResponse(error);
      loggerProxy.error({
        response,
        success: false,
        request: { data: parseEvent(), headers: event.headers },
      });
      return response;
    }
  };
