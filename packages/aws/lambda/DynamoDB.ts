import type {
  Context,
  DynamoDBRecord,
  DynamoDBStreamHandler,
} from "aws-lambda";
import { DynamoRecordLoggerProxy } from "./logger.ts";
import { DynamoEventError } from "./exceptions.ts";
import { ThrowErrorIf } from "./APIGateway.ts";
import { typedBoolean } from "types";

const Assert =
  (
    logger: ReturnType<typeof DynamoRecordLoggerProxy>,
    sequenceNumber?: string,
  ) =>
  <Value>(condition: Value, error: Error) => {
    if (!condition) {
      logger.error({ message: error.message });
      throw new DynamoEventError(error.message, sequenceNumber);
    }
    return condition;
  };

interface DynamoEventData<New, Old = New> {
  newImage?: New;
  oldImage?: Old;
  action: DynamoDBRecord["eventName"];
}
const ParseRecord =
  <New, Old = New>(record: DynamoDBRecord) =>
  (): DynamoEventData<New, Old> => {
    const newImage = record.dynamodb?.NewImage as New;
    const oldImage = record.dynamodb?.OldImage as Old;
    return { newImage, oldImage, action: record.eventName };
  };

export const dynamoMiddleware =
  <New, Old = New>(
    handler: (utils: {
      assert: <Value>(condition: Value, error: Error) => NonNullable<Value>;
      parseRecord: () => DynamoEventData<New, Old>;
      logger: ReturnType<typeof DynamoRecordLoggerProxy>;
      throwErrorIf: (error?: Error) => void;
      record: DynamoDBRecord;
      context: Context;
    }) => Promise<void>,
  ): DynamoDBStreamHandler =>
  async (event, context, callback) => {
    const responseList: DynamoEventError<unknown>[] = [];
    for (const record of event.Records) {
      const sequenceNumber = record.dynamodb?.SequenceNumber;
      const loggerProxy = DynamoRecordLoggerProxy(record, context);
      const assert = Assert(loggerProxy, sequenceNumber);
      const parseRecord = ParseRecord<New, Old>(record);
      const throwErrorIf = ThrowErrorIf(loggerProxy);
      await handler({
        throwErrorIf,
        assert,
        parseRecord,
        logger: loggerProxy,
        record,
        context,
      }).catch((error) => {
        loggerProxy.error({ error });
        responseList.push(new DynamoEventError(error.message, sequenceNumber));
      });
    }
    if (!callback) return;

    if (!responseList.length) {
      callback(null);
    } else {
      const batchItemFailures = responseList
        .map((i) => i.sequenceNumber)
        .filter(typedBoolean)
        .map((itemIdentifier) => ({ itemIdentifier }));
      callback(new Error(responseList.map((i) => i.message).join("; ")), {
        batchItemFailures,
      });
    }
  };
