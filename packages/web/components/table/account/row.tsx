"use server";
import { TableCell, TableRow } from "@/components/ui/table";
import { AccountItem } from "types";
import * as React from "react";
import UpdateName from "@/components/table/account/update-name";
import IdBadge from "@/components/table/id-badge";
import UpdateValue from "@/components/table/account/update-value";
import CellButton from "../cell-button";
import Delete from "@/components/table/account/delete";
import { Money } from "@/components/ui/format";

export default async function Row({ item }: { item: AccountItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        {item.id}
        <IdBadge id={item.id} />
      </TableCell>
      <TableCell>
        <UpdateName
          trigger={<CellButton>{item.name}</CellButton>}
          item={item}
        />
      </TableCell>
      <TableCell>
        <UpdateValue
          item={item}
          trigger={
            <CellButton>
              <Money value={item.value} />
            </CellButton>
          }
        />
      </TableCell>
      <TableCell>
        <Delete item={item} />
      </TableCell>
    </TableRow>
  );
}
