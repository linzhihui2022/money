import type { APIGatewayProxyHandlerV2, DynamoDBStreamHandler } from "aws-lambda";
import { gatewayMiddleware } from "../lambda/APIGateway.ts";
import { z } from "zod";
import { v4 } from "uuid";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  type QueryCommandOutput,
  type ScanCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import type { AccountItem, BillItem, DbItem, ISO, UUID } from "types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dayjs from "dayjs";
import { dynamoMiddleware } from "../lambda/DynamoDB.ts";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  {
    body: Omit<BillItem, "id" | "active">;
  },
  Omit<BillItem, "date"> | { date: number }
>(async ({ parseEvent, validate }) => {
  const { desc, value, account, category, date } = validate(
    () =>
      z.object({
        desc: z.string().optional().default(""),
        value: z.number(),
        account: z.string().uuid(),
        category: z.string().uuid(),
        date: z.coerce.date(),
      }),
    parseEvent(),
    "data invalid",
  );
  const id = v4();
  await client.send(
    new PutCommand({
      TableName: Resource.billDB.name,
      Item: {
        id,
        desc,
        value,
        account,
        category,
        date: dayjs(date).valueOf(),
        active: 1,
      },
    }),
  );
  return {
    id,
    desc,
    value,
    account,
    category,
    date: dayjs(date).valueOf(),
    active: 1,
  };
});

export const list: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  {
    query: {
      limit?: number;
      lastEvaluatedKey?: QueryCommandOutput["LastEvaluatedKey"];
      filter?: "account" | "category" | "all";
      value?: UUID;
      from?: ISO;
      to?: ISO;
    };
  },
  {
    Items: BillItem[];
    LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
  }
>(async ({ parseEvent, validate }) => {
  const { lastEvaluatedKey, limit, filter, from, to, value } = validate(
    () =>
      z
        .object({
          limit: z.coerce.number().optional().default(20),
          lastEvaluatedKey: z.ostring().transform((v) => (v ? JSON.parse(v) : undefined)),
          filter: z.enum(["account", "category"]).optional(),
          value: z.string().uuid().optional(),
          from: z.coerce
            .date()
            .optional()
            .default(dayjs(0).toDate())
            .transform((v) => v.getTime()),
          to: z.coerce
            .date()
            .optional()
            .default(new Date())
            .transform((v) => v.getTime()),
        })
        .refine((values) => (values.filter ? !!values.value : true)),
    parseEvent(),
    "Query error",
  );
  switch (filter) {
    case "category":
    case "account": {
      return client
        .send(
          new QueryCommand({
            TableName: Resource.billDB.name,
            IndexName: filter,
            KeyConditionExpression: `#key = :value and #date between :from and :to`,
            FilterExpression: `#active = :active`,
            ExpressionAttributeValues: {
              ":value": value!,
              ":from": from,
              ":to": to,
              ":active": 1,
            },
            ExpressionAttributeNames: {
              "#date": "date",
              "#key": filter,
              "#active": "active",
            },
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedKey,
            ScanIndexForward: false,
          }),
        )
        .then((res) => ({
          Items: res.Items as BillItem[],
          LastEvaluatedKey: res.LastEvaluatedKey,
        }));
    }
    default: {
      return client
        .send(
          new QueryCommand({
            TableName: Resource.billDB.name,
            IndexName: "active",
            Limit: limit,
            KeyConditionExpression: `#key = :value and #date between :from and :to`,
            ExpressionAttributeValues: {
              ":from": from,
              ":to": to,
              ":value": 1,
            },
            ExpressionAttributeNames: { "#date": "date", "#key": "active" },
            ExclusiveStartKey: lastEvaluatedKey,
            ScanIndexForward: false,
          }),
        )
        .then((res) => ({
          Items: res.Items as BillItem[],
          LastEvaluatedKey: res.LastEvaluatedKey,
        }));
    }
  }
});

export const get: APIGatewayProxyHandlerV2 = gatewayMiddleware<{ path: { id: string } }, { Item: BillItem | null }>(async ({ validate, parseEvent }) => {
  const { id } = validate(() => z.object({ id: z.string().uuid() }), parseEvent(), "data invalid");
  let Item: BillItem | null = null;
  let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
  do {
    const res = await client.send(
      new QueryCommand({
        TableName: Resource.billDB.name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
        ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );
    Item = (res.Items?.at(0) as BillItem) || null;
    if (Item) return { Item };
    LastEvaluatedKey = res.LastEvaluatedKey;
  } while (LastEvaluatedKey);
  return { Item };
});
const update = <T>(id: string, key: string, value: T) =>
  client.send(
    new UpdateCommand({
      TableName: Resource.billDB.name,
      Key: { id },
      UpdateExpression: "SET #key = :value",
      ExpressionAttributeValues: { ":value": value },
      ExpressionAttributeNames: { "#key": key },
    }),
  );
export const updateDesc: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { desc: string };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { desc, id } = validate(() => z.object({ desc: z.string().default(""), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "desc", desc);
});

export const updateValue: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { value: number };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { value, id } = validate(() => z.object({ value: z.number(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "value", value);
});

export const updateAccount: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { account: UUID };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { account, id } = validate(() => z.object({ account: z.string().uuid(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "account", account);
});

export const updateCategory: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { category: UUID };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { category, id } = validate(() => z.object({ category: z.string().uuid(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "category", category);
});

export const updateDate: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { date: ISO };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { date, id } = validate(() => z.object({ date: z.coerce.date(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "date", date.getTime());
});

export const updateActive: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: { active: boolean };
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { active, id } = validate(() => z.object({ active: z.boolean(), id: z.string().uuid() }), parseEvent(), "data invalid");
  await update(id, "active", +active);
});

export const del: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  path: { id: string };
}>(async ({ parseEvent, validate }) => {
  const { id } = validate(() => z.object({ id: z.string().uuid() }), parseEvent(), "data invalid");
  await client.send(new DeleteCommand({ TableName: Resource.billDB.name, Key: { id } }));
});

export const subscribe: DynamoDBStreamHandler = dynamoMiddleware<DbItem<BillItem>, DbItem<BillItem>>(async ({ parseRecord }) => {
  const { newImage, oldImage, action } = parseRecord();
  const onChange = async (item: DbItem<BillItem> | undefined, type: 1 | -1) => {
    const account = item?.account?.S;
    const value = +(item?.value.N || "");
    const active = item?.active?.N === "1";
    if (!account) return;
    if (!active) return;
    if (isNaN(value)) return;
    let Item: AccountItem | null = null;
    let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
    do {
      const res = await client.send(
        new QueryCommand({
          TableName: Resource.accountDB.name,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": account },
          ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
        }),
      );
      Item = (res.Items?.at(0) as AccountItem) || null;
      if (Item) {
        break;
      }
      LastEvaluatedKey = res.LastEvaluatedKey;
    } while (LastEvaluatedKey);
    if (!Item) return;
    await client.send(
      new UpdateCommand({
        TableName: Resource.accountDB.name,
        Key: { id: account },
        UpdateExpression: "SET #value = :value",
        ExpressionAttributeValues: { ":value": Item.value + value * type },
        ExpressionAttributeNames: { "#value": "value" },
      }),
    );
  };
  switch (action) {
    case "INSERT": {
      await onChange(newImage, -1);
      return;
    }
    case "REMOVE": {
      await onChange(oldImage, 1);
      return;
    }
    case "MODIFY": {
      await onChange(newImage, -1);
      await onChange(oldImage, 1);
      return;
    }
  }
});
