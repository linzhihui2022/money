import type {
  APIGatewayProxyHandlerV2,
  DynamoDBStreamHandler,
} from "aws-lambda";
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
import {
  type AccountItem,
  BillActive,
  type BillItem,
  type CategoryItem,
  CategoryType,
  type DbItem,
  deleteBillSchema,
  getBillSchema,
  type IDArray,
  type ISO,
  newBillSchema,
  typedBoolean,
  updateBillAccountSchema,
  updateBillCategorySchema,
  updateBillDateSchema,
  updateBillDescSchema,
  updateBillValueSchema,
  type UUID,
  zid,
} from "types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dayjs from "dayjs";
import { dynamoMiddleware } from "../lambda/DynamoDB.ts";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const add: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  { body: Omit<BillItem, "id" | "active"> },
  Omit<BillItem, "date"> | { date: number }
>(async ({ validate }) => {
  const { desc, value, account, category, date } = validate(newBillSchema);
  const id = v4();
  const Item = {
    id,
    desc,
    value,
    account,
    category,
    date: dayjs(date).valueOf(),
    active: BillActive.ACTIVE,
  };
  await client.send(new PutCommand({ TableName: Resource.billDB.name, Item }));
  return Item;
});

export const list: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  {
    query: {
      limit?: number;
      lastEvaluatedKey?: QueryCommandOutput["LastEvaluatedKey"];
      account?: IDArray;
      category?: IDArray;
      from?: ISO;
      to?: ISO;
    };
  },
  {
    Items: BillItem[];
    LastEvaluatedKey: QueryCommandOutput["LastEvaluatedKey"];
  }
>(async ({ validate }) => {
  const { lastEvaluatedKey, limit, account, from, to, category } = validate(
    () =>
      z.object({
        limit: z.coerce.number().optional().default(20),
        lastEvaluatedKey: z
          .ostring()
          .transform((v) => (v ? JSON.parse(v) : undefined)),
        account: z.ostring().refine((i) => {
          if (!i) return true;
          return z.array(zid()).safeParse(i.split(",")).success;
        }),
        category: z.ostring().refine((i) => {
          if (!i) return true;
          return z.array(zid()).safeParse(i.split(",")).success;
        }),
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
      }),
  );
  const transform = (filter: string | undefined, field: string) => {
    if (!filter) return;
    const { expression, value } = filter
      .split(",")
      .reduce<{ expression: string[]; value: Record<string, string> }>(
        (pre, cur, i) => {
          const key = `:${field}${i}`;
          pre.expression.push(key);
          pre.value[key] = cur;
          return pre;
        },
        { expression: [], value: {} },
      );
    if (expression.length)
      return {
        FilterExpression: `#${field} IN (${expression.join(",")})`,
        ExpressionAttributeValues: value,
        ExpressionAttributeNames: { [`#${field}`]: field },
      };
  };
  const categoryFilter = transform(category, "category");
  const accountFilter = transform(account, "account");
  const cmd = new QueryCommand({
    TableName: Resource.billDB.name,
    IndexName: "active",
    KeyConditionExpression: `#active = :active and #date between :from and :to`,
    FilterExpression:
      [categoryFilter?.FilterExpression, accountFilter?.FilterExpression]
        .filter(typedBoolean)
        .join(" AND ") || undefined,
    ExpressionAttributeValues: {
      ":from": from,
      ":to": to,
      ":active": BillActive.ACTIVE,
      ...categoryFilter?.ExpressionAttributeValues,
      ...accountFilter?.ExpressionAttributeValues,
    },
    ExpressionAttributeNames: {
      "#date": "date",
      "#active": "active",
      ...categoryFilter?.ExpressionAttributeNames,
      ...accountFilter?.ExpressionAttributeNames,
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
    ScanIndexForward: false,
  });
  return client.send(cmd).then((res) => ({
    Items: res.Items as BillItem[],
    LastEvaluatedKey: res.LastEvaluatedKey,
  }));
});

export const get: APIGatewayProxyHandlerV2 = gatewayMiddleware<
  { path: Pick<BillItem, "id"> },
  { Item: BillItem | null }
>(async ({ validate }) => {
  const { id } = validate(getBillSchema);
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
  body: Pick<BillItem, "desc">;
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { desc, id } = validate(updateBillDescSchema);
  await update(id, "desc", desc);
});

export const updateValue: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<BillItem, "value">;
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { value, id } = validate(updateBillValueSchema);
  await update(id, "value", value);
});

export const updateAccount: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<BillItem, "account">;
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { account, id } = validate(updateBillAccountSchema);
  await update(id, "account", account);
});

export const updateCategory: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<BillItem, "category">;
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { category, id } = validate(updateBillCategorySchema);
  await update(id, "category", category);
});

export const updateDate: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  body: Pick<BillItem, "date">;
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { date, id } = validate(updateBillDateSchema);
  await update(id, "date", date);
});

export const del: APIGatewayProxyHandlerV2 = gatewayMiddleware<{
  path: Pick<BillItem, "id">;
}>(async ({ validate }) => {
  const { id } = validate(deleteBillSchema);
  await client.send(
    new DeleteCommand({ TableName: Resource.billDB.name, Key: { id } }),
  );
});

export const subscribe: DynamoDBStreamHandler = dynamoMiddleware<
  DbItem<BillItem>,
  DbItem<BillItem>
>(async ({ parseRecord }) => {
  const { newImage, oldImage, action } = parseRecord();
  async function getAccount(accountId: UUID) {
    let Item: AccountItem | null = null;
    let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
    do {
      const res = await client.send(
        new QueryCommand({
          TableName: Resource.accountDB.name,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": accountId },
          ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
        }),
      );
      Item = (res.Items?.at(0) as AccountItem) || null;
      if (Item) {
        break;
      }
      LastEvaluatedKey = res.LastEvaluatedKey;
    } while (LastEvaluatedKey);
    return Item;
  }
  async function getCategory(categoryId: UUID) {
    let Item: CategoryItem | null = null;
    let LastEvaluatedKey: ScanCommandOutput["LastEvaluatedKey"];
    do {
      const res = await client.send(
        new QueryCommand({
          TableName: Resource.categoryDB.name,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: { ":id": categoryId },
          ...(LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
        }),
      );
      Item = (res.Items?.at(0) as CategoryItem) || null;
      if (Item) {
        break;
      }
      LastEvaluatedKey = res.LastEvaluatedKey;
    } while (LastEvaluatedKey);
    return Item;
  }
  async function onChange(item: DbItem<BillItem> | undefined, type: 1 | -1) {
    const accountId = item?.account?.S;
    const categoryId = item?.category?.S;
    const value = +(item?.value.N || "");
    const active = item?.active?.S === BillActive.ACTIVE;
    if (!accountId) return;
    if (!categoryId) return;
    if (!active) return;
    if (isNaN(value)) return;
    const account: AccountItem | null = await getAccount(accountId);
    const category: CategoryItem | null = await getCategory(categoryId);
    if (!account) return;
    if (!category) return;
    const categoryType = category.type === CategoryType.INCOME ? 1 : -1;
    await client.send(
      new UpdateCommand({
        TableName: Resource.accountDB.name,
        Key: { id: accountId },
        UpdateExpression: "SET #value = :value",
        ExpressionAttributeValues: {
          ":value": account.value + value * type * categoryType,
        },
        ExpressionAttributeNames: { "#value": "value" },
      }),
    );
  }

  switch (action) {
    case "INSERT": {
      await onChange(newImage, 1);
      return;
    }
    case "REMOVE": {
      await onChange(oldImage, -1);
      return;
    }
    case "MODIFY": {
      await onChange(newImage, 1);
      await onChange(oldImage, -1);
      return;
    }
  }
});
