"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useOptimistic,
  useTransition,
} from "react";
import { AccountItem } from "types";

interface OptimisticState {
  accounts: AccountItem[];
  lastAction: {
    type: "updated" | "new" | "deleted";
    id: string;
  } | null;
}
interface OptimisticAction {
  action: "updated" | "new" | "deleted";
  item: AccountItem;
}
interface AccountsContext extends OptimisticState {
  onAction: (action: OptimisticAction) => void;
  isPending: boolean;
}
const AccountsContext = createContext<AccountsContext>({} as AccountsContext);

export function AccountsProvider({
  children,
  accounts,
  lastAction,
}: PropsWithChildren<{
  accounts: AccountItem[];
  lastAction: OptimisticState["lastAction"];
}>) {
  const optimistic = useOptimistic<OptimisticState, OptimisticAction>(
    { accounts, lastAction },
    (state, { action, item }) => {
      switch (action) {
        case "updated":
          return {
            accounts: state.accounts.map((i) => (i.id === item.id ? item : i)),
            lastAction: { type: "updated", id: item.id },
          };
        case "new":
          return {
            accounts: [item, ...state.accounts],
            lastAction: { type: "new", id: item.id },
          };
        case "deleted":
          return {
            accounts: state.accounts.filter((i) => i.id !== item.id),
            lastAction: { type: "deleted", id: item.id },
          };
      }
    },
  );

  const [isPending, startTransition] = useTransition();
  const onAction = (action: OptimisticAction) => {
    startTransition(() => {
      optimistic[1](action);
    });
  };
  return (
    <AccountsContext.Provider value={{ isPending, onAction, ...optimistic[0] }}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  return useContext(AccountsContext);
}
