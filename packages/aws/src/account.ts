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
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { gatewayMiddleware } from "../lambda/APIGateway.ts";
import { Resource } from "sst";
import { z } from "zod";
import { type AccountItem, zid } from "types";
import { BadRequestError } from "../lambda/exceptions.ts";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const list: APIGatewayProxyHandlerV2 = gatewayMiddleware(async () => {
  const Items: AccountItem[] = [];
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new ScanCommand({
        TableName: Resource.accountDB.name,
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    LastEvaluatedKey = res.LastEvaluatedKey;
    if (res.Items) {
      Items.push(...(res.Items as AccountItem[]));
    }
    Count += res.Count || 0;
  } while (LastEvaluatedKey);
  return { Count, Items };
});

export const get: APIGatewayProxyHandlerV2 = gatewayMiddleware<{ path: { id: string } }, { Item: AccountItem | null }>(async ({ validate, parseEvent }) => {
  const { id } = validate(() => z.object({ id: z.string().uuid() }), parseEvent(), "data invalid");
  let Item: AccountItem | null = null;
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.accountDB.name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    Item = (res.Items?.at(0) as AccountItem) || null;
    if (Item) return { Item };
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  return { Item };
});
export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<{ body: Omit<AccountItem, ""> }, AccountItem>(async ({ parseEvent, validate, throwErrorIf }) => {
  const { name, value, id } = validate(() => z.object({ name: z.string().min(1), value: z.number(), id: zid() }), parseEvent(), "data invalid");
  let LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.accountDB.name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    Count += res.Count || 0;
    if (Count > 0) throwErrorIf(new BadRequestError(`${id} already exists`));
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  await client.send(new PutCommand({ TableName: Resource.accountDB.name, Item: { name, value, id } }));
  return { name, value, id };
});

export const updateName: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { name: string };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { name, id } = validate(() => z.object({ name: z.string().min(1), id: z.string().uuid() }), parseEvent(), "data invalid");
  await client.send(
    new UpdateCommand({
      TableName: Resource.accountDB.name,
      Key: { id },
      UpdateExpression: "SET #name = :name",
      ExpressionAttributeValues: { ":name": name },
      ExpressionAttributeNames: { "#name": "name" },
    }),
  );
});

export const updateValue: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { value: number };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { value, id } = validate(() => z.object({ value: z.number(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await client.send(
    new UpdateCommand({
      TableName: Resource.accountDB.name,
      Key: { id },
      UpdateExpression: "SET #value = :value",
      ExpressionAttributeValues: { ":value": value },
      ExpressionAttributeNames: { "#value": "value" },
    }),
  );
});

export const del: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { id } = validate(() => z.object({ id: z.string().uuid() }), parseEvent(), "data invalid");
  await client.send(new DeleteCommand({ TableName: Resource.accountDB.name, Key: { id } }));
});
