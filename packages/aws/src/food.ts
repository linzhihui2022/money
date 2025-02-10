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
import {
  deleteFoodSchema,
  FOOD,
  type FoodItem,
  newFoodSchema,
  updateFoodImageSchema,
  updateFoodNameSchema,
  updateFoodTypeSchema,
} from "types";
import { Resource } from "sst";
import { BadRequestError } from "../lambda/exceptions.ts";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const list: APIGatewayProxyHandlerV2 = gatewayMiddleware(async () => {
  const Items: FoodItem[] = [];
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new ScanCommand({
        TableName: Resource.foodDB.name,
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    LastEvaluatedKey = res.LastEvaluatedKey;
    if (res.Items) {
      Items.push(...(res.Items as FoodItem[]));
    }
    Count += res.Count || 0;
  } while (LastEvaluatedKey);
  return { Count, Items };
});

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  { body: FoodItem },
  FoodItem
>(async ({ validate, throwErrorIf }) => {
  const { name, image, type, id } = validate(newFoodSchema);
  let LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
  let Count = 0;
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.foodDB.name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    Count += res.Count || 0;
    if (Count > 0)
      throwErrorIf(
        new BadRequestError(`${id} already exists`, FOOD.FOOD_EXISTS),
      );
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  await client.send(
    new PutCommand({
      TableName: Resource.foodDB.name,
      Item: { name, image, id, type },
    }),
  );
  return { name, image, id, type };
});
const update = <T>(id: string, key: string, value: T) =>
  client.send(
    new UpdateCommand({
      TableName: Resource.foodDB.name,
      Key: { id },
      UpdateExpression: "SET #key = :value",
      ExpressionAttributeValues: { ":value": value },
      ExpressionAttributeNames: { "#key": key },
    }),
  );
export const updateName: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<FoodItem, "name">;
  path: Pick<FoodItem, "id">;
}>(async ({ validate }) => {
  const { id, name } = validate(updateFoodNameSchema);
  await update(id, "name", name);
});
export const updateType: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<FoodItem, "type">;
  path: Pick<FoodItem, "id">;
}>(async ({ validate }) => {
  const { type, id } = validate(updateFoodTypeSchema);
  await update(id, "type", type);
});
export const updateImage: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<FoodItem, "image">;
  path: Pick<FoodItem, "id">;
}>(async ({ validate }) => {
  const { image, id } = validate(updateFoodImageSchema);
  await update(id, "image", image);
});
export const del: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  path: Pick<FoodItem, "id">;
}>(async ({ validate }) => {
  const { id } = validate(deleteFoodSchema);
  await client.send(
    new DeleteCommand({ TableName: Resource.foodDB.name, Key: { id } }),
  );
});
