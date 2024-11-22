import { type APIGatewayProxyHandlerV2 } from "aws-lambda";
import { gatewayMiddleware } from "../lambda/APIGateway.ts";
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
import { BadRequestError } from "../lambda/exceptions.ts";
import { z } from "zod";
import { type CategoryItem, CategoryType, zid } from "types";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

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

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<{ body: Omit<CategoryItem, ""> }, CategoryItem>(
  async ({ parseEvent, validate, throwErrorIf }) => {
    const { value, type, id } = validate(
      () =>
        z
          .object({ value: z.string().min(1), id: zid(), type: z.enum([CategoryType.EXPENSES, CategoryType.INCOME]) })
          .refine(({ id }) => id !== "root", { message: `id can't be "root"`, path: ["id"] }),
      parseEvent(),
      "data invalid",
    );
    let LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
    let Count = 0;
    do {
      const res = await client.send(
        new QueryCommand({
          TableName: Resource.categoryDB.name,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": id },
          ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
        }),
      );
      Count += res.Count || 0;
      if (Count > 0) throwErrorIf(new BadRequestError(`${id} already exists`));
      LastEvaluatedKey = res.LastEvaluatedKey;
    } while (LastEvaluatedKey);
    await client.send(new PutCommand({ TableName: Resource.categoryDB.name, Item: { value, id, type } }));
    return { value, id, type };
  },
);

export const updateText: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { value: string };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { id, value } = validate(() => z.object({ id: z.string().uuid(), value: z.string().min(1) }), parseEvent(), "data invalid");
  await client.send(
    new UpdateCommand({
      TableName: Resource.categoryDB.name,
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
  await client.send(new DeleteCommand({ TableName: Resource.categoryDB.name, Key: { id } }));
});
