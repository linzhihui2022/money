import type { Code } from "types/code.ts";

export class BadRequestError extends Error {
  statusCode = 400 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  statusCode = 403 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class NotFoundError extends Error {
  statusCode = 404 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class MethodNotAllowedError extends Error {
  statusCode = 405 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class RequestRejectedError extends Error {
  statusCode = 409 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class ServerError extends Error {
  statusCode = 500 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class NotImplementedError extends Error {
  statusCode = 501 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class BadGatewayError extends Error {
  statusCode = 502 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export class ServiceUnavailableError extends Error {
  statusCode = 503 as const;

  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}

export type StandardisedError =
  | ServiceUnavailableError
  | BadGatewayError
  | NotImplementedError
  | ServerError
  | MethodNotAllowedError
  | NotFoundError
  | ForbiddenError
  | UnauthorizedError
  | BadRequestError
  | RequestRejectedError;

export class SqsEventError extends Error {
  constructor(
    message: string,
    public messageId: string,
  ) {
    super(message);
  }
}

export class TriggerError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class EventBridgeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class S3EventError<T> extends Error {
  constructor(
    message: string,
    public filePath: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class DynamoEventError<T> extends Error {
  constructor(
    message: string,
    public sequenceNumber?: string,
    public details?: T,
  ) {
    super(message);
  }
}
