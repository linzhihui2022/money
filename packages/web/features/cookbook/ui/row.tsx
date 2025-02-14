"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { getCookbooks } from "api/cookbook";
import {
  createContext,
  Fragment,
  useContext,
  useMemo,
  useOptimistic,
} from "react";
import { FoodTypeCircle } from "@/components/ui/food-type";
import Delete from "@cookbook/table/delete";
import UpdateCookbook from "@cookbook/table/update-cookbook";
import UpdateCookbookItems from "@cookbook/table/update-cookbook-items";
import { Food } from "@prisma-client";

type Cookbook = Awaited<ReturnType<typeof getCookbooks>>[number];
type CookbookItem = Cookbook["items"][number];

interface OptimisticItem extends CookbookItem {
  __deleted: boolean;
  __new: boolean;
}
interface OptimisticRow extends Omit<Cookbook, "items"> {
  __deleted: boolean;
  items: OptimisticItem[];
}
interface CookbookRowState {
  row: OptimisticRow;
  foods: Food[];
  updateRow: (
    action:
      | OptimisticRow
      | ((pendingOptimisticItem: OptimisticRow) => OptimisticRow),
  ) => void;
}
const CookbookRowContext = createContext<CookbookRowState>(
  {} as CookbookRowState,
);

export const CookbookRow = ({
  row: _row,
  foods,
}: {
  row: Cookbook;
  foods: Food[];
}) => {
  const [row, updateRow] = useOptimistic({
    ..._row,
    __deleted: false,
    items: _row.items.map((i) => ({ ...i, __new: false, __deleted: false })),
  });
  const value = useMemo(
    () => ({ row, updateRow, foods }),
    [row, updateRow, foods],
  );

  return (
    <CookbookRowContext.Provider value={value}>
      <TableRow className="has-[[data-deleted=yes]]:hidden">
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <UpdateCookbook>{row.name}</UpdateCookbook>
        </TableCell>
        <TableCell>
          <UpdateCookbookItems>
            <span className="flex flex-wrap">
              {row.items
                .filter((i) => !i.__deleted)
                .map((item) => (
                  <Fragment key={item.id}>
                    <span className="flex space-x-1 pr-1">
                      <FoodTypeCircle label={false} type={item.food.type} />
                      <span>
                        {item.food.name} {item.quantity}
                        {item.food.unit}
                      </span>
                    </span>
                  </Fragment>
                ))}
            </span>
          </UpdateCookbookItems>
        </TableCell>
        <TableCell>
          <Delete />
        </TableCell>
      </TableRow>
    </CookbookRowContext.Provider>
  );
};

export const useCookbookRow = () => useContext(CookbookRowContext);
