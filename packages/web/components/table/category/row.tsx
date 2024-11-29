"use server";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryItem } from "types";
import * as React from "react";
import IdBadge from "@/components/table/id-badge";
import UpdateValue from "@/components/table/category/update-value";
import CellButton from "@/components/table/cell-button";
import Delete from "@/components/table/category/delete";

export default async function Row({ item }: { item: CategoryItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        {item.id}
        <IdBadge id={item.id} />
      </TableCell>
      <TableCell>
        <UpdateValue
          trigger={<CellButton>{item.value}</CellButton>}
          item={item}
        />
      </TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>
        <Delete item={item} />
      </TableCell>
    </TableRow>
  );
}
