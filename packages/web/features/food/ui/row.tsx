"use client"

import { FoodTypeCircle } from "@/components/ui/food-type"
import { TableCell, TableRow } from "@/components/ui/table"
import Delete from "@food/table/delete"
import UpdateFood from "@food/table/update-food"
import { Food } from "@prisma-client"
import { createContext, useContext, useMemo, useOptimistic } from "react"

interface OptimisticRow extends Food {
    __deleted: boolean
}
interface FoodRowState {
    row: OptimisticRow
    updateRow: (action: OptimisticRow | ((pendingOptimisticItem: OptimisticRow) => OptimisticRow)) => void
}

const FoodRowContext = createContext<FoodRowState>({} as FoodRowState)

export function FoodRow({ row: _row }: { row: Food }) {
    const [row, updateRow] = useOptimistic({ ..._row, __deleted: false })
    const value = useMemo(() => ({ row, updateRow }), [row, updateRow])
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
    )
}

export const useFoodRow = () => useContext(FoodRowContext)
