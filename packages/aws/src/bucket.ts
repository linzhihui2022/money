import type { S3Handler } from "aws-lambda";
import { bucketMiddleware } from "../lambda/S3.ts";
import converter from "json-2-csv";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { billSchema, newAccountSchema, newCategorySchema } from "types";

const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const _import: S3Handler = bucketMiddleware(
  async ({ readFile, parseEvent }) => {
    const { key } = parseEvent();
    const matchers = key.match(/^(.*)\.import\.csv$/);
    if (matchers) {
      const db = matchers[1] as "account" | "category" | "bill";
      const csv = await readFile();
      switch (db) {
        case "bill": {
          const schema = billSchema();
          const items = converter
            .csv2json(csv.split("\n").filter(Boolean).join("\n"))
            .map((i) => schema.safeParse(i))
            .filter((i) => i.success)
            .map((i) => i.data);
          while (items.length) {
            const Items = items.splice(0, 25);
            await dbClient.send(
              new BatchWriteCommand({
                RequestItems: {
                  [Resource.billDB.name]: Items.map((Item) => ({
                    PutRequest: { Item },
                  })),
                },
              }),
            );
          }
          return;
        }
        case "account": {
          const schema = newAccountSchema();
          const items = converter
            .csv2json(csv.split("\n").filter(Boolean).join("\n"))
            .map((i) => schema.safeParse(i))
            .filter((i) => i.success)
            .map((i) => i.data);
          while (items.length) {
            const Items = items.splice(0, 25);
            await dbClient.send(
              new BatchWriteCommand({
                RequestItems: {
                  [Resource.accountDB.name]: Items.map((Item) => ({
                    PutRequest: { Item },
                  })),
                },
              }),
            );
          }
          return;
        }
        case "category": {
          const schema = newCategorySchema();
          const items = converter
            .csv2json(csv.split("\n").filter(Boolean).join("\n"))
            .map((i) => schema.safeParse(i))
            .filter((i) => i.success)
            .map((i) => i.data);
          while (items.length) {
            const Items = items.splice(0, 25);
            await dbClient.send(
              new BatchWriteCommand({
                RequestItems: {
                  [Resource.categoryDB.name]: Items.map((Item) => ({
                    PutRequest: { Item },
                  })),
                },
              }),
            );
          }
          return;
        }
      }
    }
  },
);
