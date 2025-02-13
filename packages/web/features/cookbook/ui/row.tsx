"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { getCookbooks } from "api/cookbook";
import { createContext, useContext, useMemo, useOptimistic } from "react";
import { FoodTypeCircle } from "@/components/ui/food-type";
import Delete from "@cookbook/table/delete";
import UpdateCookbook from "@cookbook/table/update-cookbook";

type Cookbook = Awaited<ReturnType<typeof getCookbooks>>[number];
interface OptimisticRow extends Cookbook {
  __deleted: boolean;
}
interface CookbookRowState {
  row: OptimisticRow;
  updateRow: (
    action:
      | OptimisticRow
      | ((pendingOptimisticItem: OptimisticRow) => OptimisticRow),
  ) => void;
}
const CookbookRowContext = createContext<CookbookRowState>(
  {} as CookbookRowState,
);

export const CookbookRow = ({ row: _row }: { row: Cookbook }) => {
  const [row, updateRow] = useOptimistic({ ..._row, __deleted: false });
  const value = useMemo(() => ({ row, updateRow }), [row, updateRow]);
  return (
    <CookbookRowContext.Provider value={value}>
      <TableRow className="has-[[data-deleted=yes]]:hidden">
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <UpdateCookbook>{row.name}</UpdateCookbook>
        </TableCell>
        <TableCell>
          <span className="flex flex-wrap">
            {row.items.map((item) => (
              <span key={item.id} className="flex space-x-1 pr-0.5">
                <FoodTypeCircle label={false} type={item.food.type} />
                <span>
                  {item.food.name} {item.quantity}
                  {item.food.unit}
                </span>
              </span>
            ))}
          </span>
        </TableCell>
        <TableCell>
          <Delete />
        </TableCell>
      </TableRow>
    </CookbookRowContext.Provider>
  );
};

export const useCookbookRow = () => useContext(CookbookRowContext);
