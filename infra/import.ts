import { accountDB, categoryDB, billDB } from "./db";

export const importBucket = new sst.aws.Bucket("importBucket");
importBucket.subscribe(
  {
    handler: "packages/aws/src/bucket._import",
    link: [importBucket, accountDB, categoryDB, billDB],
  },
  { filterSuffix: ".import.csv", events: ["s3:ObjectCreated:*"] },
);
