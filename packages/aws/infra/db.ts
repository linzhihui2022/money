export const billDB = new sst.aws.Dynamo("billDB", {
  fields: { id: "string", date: "number", active: "string" },
  primaryIndex: { hashKey: "id" },
  globalIndexes: { active: { hashKey: "active", rangeKey: "date" } },
  stream: "new-and-old-images",
  transform: { table: { pointInTimeRecovery: { enabled: false } } },
});

export const accountDB = new sst.aws.Dynamo("accountDB", {
  fields: { id: "string" },
  primaryIndex: { hashKey: "id" },
  transform: { table: { pointInTimeRecovery: { enabled: false } } },
});
export const categoryDB = new sst.aws.Dynamo("categoryDB", {
  fields: { id: "string" },
  primaryIndex: { hashKey: "id" },
  transform: { table: { pointInTimeRecovery: { enabled: false } } },
});
export const foodDB = new sst.aws.Dynamo("foodDB", {
  fields: { id: "string" },
  primaryIndex: { hashKey: "id" },
  transform: { table: { pointInTimeRecovery: { enabled: false } } },
});
billDB.subscribe("updateAccount", {
  handler: "src/bill.subscribe",
  link: [accountDB, billDB, categoryDB],
});
