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
import {
  type CategoryItem,
  deleteCategorySchema,
  getCategorySchema,
  newCategorySchema,
  updateCategoryTextSchema,
} from "types";
import { CATEGORY } from "types/code.ts";

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

export const get: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  { path: Pick<CategoryItem, "id"> },
  { Item: CategoryItem | null }
>(async ({ validate }) => {
  const { id } = validate(getCategorySchema);
  let Item: CategoryItem | null = null;
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.categoryDB.name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    Item = (res.Items?.at(0) as CategoryItem) || null;
    if (Item) return { Item };
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  return { Item };
});

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  { body: CategoryItem },
  CategoryItem
>(async ({ validate, throwErrorIf }) => {
  const { value, type, id } = validate(newCategorySchema);
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
    if (Count > 0)
      throwErrorIf(
        new BadRequestError(`${id} already exists`, CATEGORY.ALREADY_EXISTS),
      );
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  await client.send(
    new PutCommand({
      TableName: Resource.categoryDB.name,
      Item: { value, id, type },
    }),
  );
  return { value, id, type };
});

export const updateText: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<CategoryItem, "value">;
  path: Pick<CategoryItem, "id">;
}>(async ({ validate }) => {
  const { id, value } = validate(updateCategoryTextSchema);
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
  path: Pick<CategoryItem, "id">;
}>(async ({ validate }) => {
  const { id } = validate(deleteCategorySchema);
  await client.send(
    new DeleteCommand({ TableName: Resource.categoryDB.name, Key: { id } }),
  );
});
