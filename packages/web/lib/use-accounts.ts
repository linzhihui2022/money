import { useCallback } from "react";
import { AccountItem } from "types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useAccountsQuery = () => {
  return useQuery<AccountItem[]>({
    queryKey: ["accounts"],
    queryFn: () =>
      api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }).then(
        (res) => res.Items,
      ),
    initialData: [],
  });
};

export const useRevalidateAccounts = () => {
  const client = useQueryClient();
  return useCallback(
    () => client.invalidateQueries({ queryKey: ["accounts"] }),
    [client],
  );
};
