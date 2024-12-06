import { api } from "@/lib/api";
import { AccountItem } from "types";

export const getAccounts = async () =>
  api<{ Count: number; Items: AccountItem[] }>({
    uri: "/accounts",
    next: { tags: ["accounts"] },
  }).then((res) => res.data?.Items || []);
