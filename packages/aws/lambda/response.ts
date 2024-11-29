import { type StandardisedError } from "./exceptions";
import { type AwsResponse, COMMON, type ErrorBody } from "types";

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
  if (!body) {
    return createResponse<T>(204, body, headers);
  }
  return createResponse<T>(200, body, headers);
}

export function createErrorResponse(
  error: StandardisedError,
  headers: { [key: string]: string } = {},
) {
  const body: ErrorBody = {
    message: error.message,
    code: error.code || COMMON.UNEXPECTED,
  };
  return createResponse(error.statusCode, body, headers);
}

export const ResponseHeaders = () => {
  const headers: Record<string, string> = {};
  return {
    add: (key: string, value: string) => (headers[key] = value),
    remove: (key: string) => delete headers[key],
    output: () => headers,
  };
};

export const errorHandle = async <E extends Error, T>(
  fn: () => Promise<T>,
  standardisedError: (error: E) => StandardisedError,
): Promise<AwsResponse<T, StandardisedError>> => {
  try {
    const res = await fn();
    return ["OK", res];
  } catch (_error) {
    const error = _error as E;
    return ["fail", standardisedError(error)];
  }
};
