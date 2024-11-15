import type { Context, S3Event, S3EventRecord, S3Handler } from "aws-lambda";
import { S3EventRecordLoggerProxy } from "./logger.ts";
import { S3EventError } from "./exceptions.ts";
import { ThrowErrorIf } from "./APIGateway.ts";
import { gunzipSync } from "zlib";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface S3EventData {
  bucket: string;
  key: string;
  versionId?: string | undefined;
}
const ParseRecord = (record: S3EventRecord) => (): S3EventData => {
  const {
    bucket: { name: bucket },
    object: { key, versionId },
  } = record.s3;
  return { bucket, key, versionId };
};
const readBucketFile = async (bucket: string, filename: string) => {
  const params = { Bucket: bucket, Key: filename };
  const s3 = new S3Client();
  try {
    const response = await s3.send(new GetObjectCommand(params));
    if (filename.endsWith(".gz")) {
      return (
        response.Body?.transformToByteArray()
          .then((res) => res.buffer as ArrayBuffer)
          .then((buffer) => gunzipSync(buffer).toString("utf-8")) || ""
      );
    }
    return (await response.Body?.transformToString()) || "";
  } catch (error) {
    throw new S3EventError(`Fetch bucket file failed`, filename, error);
  }
};
const Assert =
  (logger: ReturnType<typeof S3EventRecordLoggerProxy>, filePath: string) =>
  <Value>(condition: Value, error: Error) => {
    if (!condition) {
      logger.error({ message: error.message });
      throw new S3EventError(error.message, filePath);
    }
    return condition;
  };

export const bucketMiddleware =
  (
    handler: (utils: {
      assert: <Value>(condition: Value, error: Error) => NonNullable<Value>;
      parseEvent: () => S3EventData;
      logger: ReturnType<typeof S3EventRecordLoggerProxy>;
      throwErrorIf: (error?: Error) => void;
      record: S3EventRecord;
      context: Context;
      readFile: () => Promise<string>;
    }) => Promise<void>,
  ): S3Handler =>
  async (event: S3Event, context: Context) => {
    for (const record of event.Records) {
      const requestId = context.awsRequestId;
      const loggerProxy = S3EventRecordLoggerProxy(record, context);
      const assert = Assert(loggerProxy, requestId);
      const parseEvent = ParseRecord(record);
      const throwErrorIf = ThrowErrorIf(loggerProxy);
      const data = parseEvent();
      const filePath = `${data.bucket}/${data.key}`;
      const readFile = () => readBucketFile(data.bucket, data.key);
      await handler({
        throwErrorIf,
        assert,
        parseEvent,
        logger: loggerProxy,
        record,
        context,
        readFile,
      }).catch((error) => {
        loggerProxy.error({ error, filePath });
      });
    }
  };
