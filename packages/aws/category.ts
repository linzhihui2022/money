import { type APIGatewayProxyHandlerV2 } from "aws-lambda";
import { gatewayMiddleware } from "./lambda/APIGateway.ts";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  type QueryCommandOutput,
  ScanCommand,
  type ScanCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { BadRequestError } from "./lambda/exceptions.ts";
import { v4 } from "uuid";
import { z } from "zod";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
interface CategoryItem {
  id: string;
  pid: string;
  value: string;
}

export const list: APIGatewayProxyHandlerV2 = gatewayMiddleware(async () => {
  const Items: CategoryItem[] = [];
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new ScanCommand({
        TableName: Resource.categoryDB.name,
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    LastEvaluatedKey = res.LastEvaluatedKey;
    if (res.Items) {
      Items.push(...(res.Items as CategoryItem[]));
    }
    Count += res.Count || 0;
  } while (LastEvaluatedKey);
  return { Count, Items };
});

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: {
    pid?: string;
    text: string;
  };
}>(async ({ parseEvent, validate }) => {
  const { pid, text: value } = validate(
    () => z.object({ pid: z.string().optional(), text: z.string().min(1) }),
    parseEvent(),
    "data invalid",
  );
  const id = v4();
  await client.send(
    new PutCommand({
      TableName: Resource.categoryDB.name,
      Item: { pid, value, id },
    }),
  );
});

export const updateText: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { text: string };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { id, text } = validate(
    () => z.object({ id: z.string().uuid(), text: z.string().min(1) }),
    parseEvent(),
    "data invalid",
  );
  await client.send(
    new UpdateCommand({
      TableName: Resource.categoryDB.name,
      Key: { id },
      UpdateExpression: "SET #value = :value",
      ExpressionAttributeValues: { ":value": text },
      ExpressionAttributeNames: { "#value": "value" },
    }),
  );
});

export const updateParent: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { pid: string };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { id, pid } = validate(
    () => z.object({ id: z.string().uuid(), pid: z.string().min(1) }),
    parseEvent(),
    "data invalid",
  );
  await client.send(
    new UpdateCommand({
      TableName: Resource.categoryDB.name,
      Key: { id },
      UpdateExpression: "SET #pid = :pid",
      ExpressionAttributeValues: { ":pid": pid },
      ExpressionAttributeNames: { "#pid": "pid" },
    }),
  );
});

export const del: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  path: { id: string };
}>(async ({ parseEvent, validate, throwErrorIf }) => {
  const { id } = validate(
    () => z.object({ id: z.string().uuid() }),
    parseEvent(),
    "data invalid",
  );
  let LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.categoryDB.name,
        IndexName: "pid",
        KeyConditionExpression: "pid = :pid",
        ExpressionAttributeValues: { ":pid": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    LastEvaluatedKey = res.LastEvaluatedKey;
    Count += res.Count || 0;
  } while (LastEvaluatedKey);
  if (Count > 0) {
    throwErrorIf(new BadRequestError(`${id} has ${Count} children`));
    return;
  }
  await client.send(
    new DeleteCommand({ TableName: Resource.categoryDB.name, Key: { id } }),
  );
});
