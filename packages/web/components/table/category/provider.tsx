"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useOptimistic,
  useTransition,
} from "react";
import { CategoryItem } from "types";

interface OptimisticState {
  categories: CategoryItem[];
  lastAction: {
    type: "updated" | "new" | "deleted";
    id: string;
  } | null;
}
interface OptimisticAction {
  action: "updated" | "new" | "deleted";
  item: CategoryItem;
}
interface CategoriesContext extends OptimisticState {
  onAction: (action: OptimisticAction) => void;
  isPending: boolean;
}
const CategoriesContext = createContext<CategoriesContext>(
  {} as CategoriesContext,
);

export function CategoriesProvider({
  children,
  categories,
  lastAction,
}: PropsWithChildren<{
  categories: CategoryItem[];
  lastAction: OptimisticState["lastAction"];
}>) {
  const optimistic = useOptimistic<OptimisticState, OptimisticAction>(
    { categories, lastAction },
    (state, { action, item }) => {
      switch (action) {
        case "updated":
          return {
            categories: state.categories.map((i) =>
              i.id === item.id ? item : i,
            ),
            lastAction: { type: "updated", id: item.id },
          };
        case "new":
          return {
            categories: [item, ...state.categories],
            lastAction: { type: "new", id: item.id },
          };
        case "deleted":
          return {
            categories: state.categories.filter((i) => i.id !== item.id),
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
    <CategoriesContext.Provider
      value={{ isPending, onAction, ...optimistic[0] }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
