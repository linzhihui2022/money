"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryItem } from "types";
import * as React from "react";
import UpdateValue from "@/components/table/category/update-value";
import Delete from "@/components/table/category/delete";
import { useCategories } from "./provider";
import { Badge } from "@/components/ui/badge";

function IdBadge({ id }: { id: string }) {
  const { lastAction } = useCategories();
  if (lastAction?.id === id) {
    return (
      <Badge variant="default" className="ml-2 uppercase">
        {lastAction.type}
      </Badge>
    );
  }

  return <></>;
}
export default function CategoriesTableBody() {
  const { categories } = useCategories();
  return (
    <>
      {categories.map((i) => (
        <Row item={i} key={i.id} />
      ))}
    </>
  );
}

function Row({ item }: { item: CategoryItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        {item.id}
        <IdBadge id={item.id} />
      </TableCell>
      <TableCell>
        <UpdateValue item={item} />
      </TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>
        <Delete item={item} />
      </TableCell>
    </TableRow>
  );
}
