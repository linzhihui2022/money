import { type StandardisedError } from "./exceptions";

export interface ErrorBody<T = unknown> {
  error: {
    message: string;
    statusCode: number;
    details: T;
  };
}

const createResponse = <T>(
  statusCode: number,
  body: T,
  headers: { [key: string]: string } = {},
) => ({
  isBase64Encoded: false,
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    ...headers,
  },
  body: JSON.stringify(body),
});

export function responseRedirect(Location: string) {
  return createResponse<Record<string, never>>(302, {}, { Location });
}

export function responseOk<T>(
  body: T,
  headers: { [key: string]: string } = {},
) {
  return createResponse<T>(200, body, headers);
}

export function createErrorResponse<T>(
  statusCode: number,
  message: string,
  details?: T,
  headers: { [key: string]: string } = {},
) {
  const body: ErrorBody = { error: { message, statusCode, details } };
  return createResponse(statusCode, JSON.stringify(body), headers);
}

export const ResponseHeaders = () => {
  const headers: Record<string, string> = {};
  return {
    add: (key: string, value: string) => (headers[key] = value),
    remove: (key: string) => delete headers[key],
    output: () => headers,
  };
};

export type ServiceResponse<Data, E = unknown> = [null, Data] | [E, null];
export type Resp<T> = Promise<ServiceResponse<T>>;

export const errorHandle = async <E extends Error, T>(
  fn: () => Promise<T>,
  standardisedError: (error: E) => StandardisedError<E>,
): Promise<ServiceResponse<T, StandardisedError<E>>> => {
  try {
    const res = await fn();
    return [null, res];
  } catch (_error) {
    const error = _error as E;
    return [standardisedError(error), null];
  }
};
