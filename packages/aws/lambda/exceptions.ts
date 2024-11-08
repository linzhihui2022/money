export class BadRequestError<T> extends Error {
  statusCode = 400 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class UnauthorizedError<T> extends Error {
  statusCode = 401 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class ForbiddenError<T> extends Error {
  statusCode = 403 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class NotFoundError<T> extends Error {
  statusCode = 404 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class MethodNotAllowedError<T> extends Error {
  statusCode = 405 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class RequestRejectedError<T> extends Error {
  statusCode = 409 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class ServerError<T> extends Error {
  statusCode = 500 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class NotImplementedError<T> extends Error {
  statusCode = 501 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class BadGatewayError<T> extends Error {
  statusCode = 502 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export class ServiceUnavailableError<T> extends Error {
  statusCode = 503 as const;

  constructor(
    message: string,
    public details?: T,
  ) {
    super(message);
  }
}

export type StandardisedError<T> =
  | ServiceUnavailableError<T>
  | BadGatewayError<T>
  | NotImplementedError<T>
  | ServerError<T>
  | MethodNotAllowedError<T>
  | NotFoundError<T>
  | ForbiddenError<T>
  | UnauthorizedError<T>
  | BadRequestError<T>
  | RequestRejectedError<T>;

export class SqsEventError extends Error {
  constructor(
    message: string,
    public messageId: string,
  ) {
    super(message);
  }
}

export class EventBridgeError extends Error {
  constructor(message: string) {
    super(message);
  }
}
