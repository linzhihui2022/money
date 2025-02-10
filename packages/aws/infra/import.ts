import { accountDB, categoryDB, billDB, foodDB } from "./db";

export const importBucket = new sst.aws.Bucket("importBucket");
importBucket.subscribe(
  {
    handler: "src/bucket._import",
    link: [importBucket, accountDB, categoryDB, billDB, foodDB],
  },
  { filterSuffix: ".import.csv", events: ["s3:ObjectCreated:*"] },
);
