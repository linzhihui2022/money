import { klona } from "klona/json";
import traverse from "traverse";
import winston, { type LeveledLogMethod, Logger } from "winston";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";

const logLevel = process.env.LOG_LEVEL || "debug";
const sensitiveKeys = [
  /cookie/i,
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /api[-._]?key/i,
  /authorization/,
  /Authorization/,
];

function isSensitiveKey(keyStr: string) {
  if (keyStr) return sensitiveKeys.some((regex) => regex.test(keyStr));
}

function redactObject(obj: Record<string, unknown>) {
  traverse(obj).forEach(function redactor() {
    if (this.key && isSensitiveKey(this.key)) {
      this.update("[REDACTED]");
    }
  });
}

function redact(obj: Record<string, unknown>) {
  const copy = klona(obj); // Making a deep copy to prevent side effects
  redactObject(copy);
  return copy;
}

export const createLogger = (): Logger => {
  return winston.createLogger({
    level: logLevel,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format((info) => ({ ...info, message: redact(info.message) }))(),
      winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
      ),
      winston.format.json(),
    ),
  });
};

export const LoggerProxy = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => {
  const logger = createLogger();
  return new Proxy(logger, {
    get(_, prop, receiver) {
      return async (
        data: Parameters<LeveledLogMethod>[0],
        ...args: unknown[]
      ) => {
        if (typeof data === "object") {
          const apiGatewayRequestId = event?.requestContext?.requestId;
          const functionName = context.functionName;
          const lambdaRequestId = context?.awsRequestId || "";
          const correlationId = event?.headers?.["x-correlation-id"] || "";
          return Reflect.get(
            logger,
            prop,
            receiver,
          )(
            {
              ...data,
              apiGatewayRequestId,
              lambdaRequestId,
              functionName,
              correlationId,
            },
            ...args,
          );
        }
        return Reflect.get(logger, prop, receiver)(data, ...args);
      };
    },
  });
};
