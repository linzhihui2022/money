"use client";
import { Food } from "@prisma-client";
import { TableCell, TableRow } from "@/components/ui/table";
import UpdateFood from "@food/table/update-food";
import Delete from "@food/table/delete";
import { createContext, useContext, useMemo, useOptimistic } from "react";
import { FoodTypeCircle } from "@/components/ui/food-type";

interface OptimisticRow extends Food {
  __deleted: boolean;
}
interface FoodRowState {
  row: OptimisticRow;
  updateRow: (
    action:
      | OptimisticRow
      | ((pendingOptimisticItem: OptimisticRow) => OptimisticRow),
  ) => void;
}

const FoodRowContext = createContext<FoodRowState>({} as FoodRowState);

export function FoodRow({ row: _row }: { row: Food }) {
  const [row, updateRow] = useOptimistic({ ..._row, __deleted: false });
  const value = useMemo(() => ({ row, updateRow }), [row, updateRow]);
  return (
    <FoodRowContext.Provider value={value}>
      <TableRow className="has-[[data-deleted=yes]]:hidden">
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <UpdateFood>{row.name}</UpdateFood>
        </TableCell>
        <TableCell>
          <UpdateFood>
            <FoodTypeCircle type={row.type} />
          </UpdateFood>
        </TableCell>
        <TableCell>
          <UpdateFood>{`${row.stock} ${row.unit}`}</UpdateFood>
        </TableCell>
        <TableCell>
          <Delete />
        </TableCell>
      </TableRow>
    </FoodRowContext.Provider>
  );
}

export const useFoodRow = () => useContext(FoodRowContext);
