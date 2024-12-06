import { api } from "@/lib/api";
import { AccountItem } from "types";

export const getAccounts = async () =>
  api<{ Count: number; Items: AccountItem[] }>({
    uri: "/accounts",
    cache: "force-cache",
    next: { tags: ["accounts"], revalidate: 60 * 10 * 24 },
  }).then((res) => res.data?.Items || []);
