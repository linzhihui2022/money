"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { AccountItem } from "types";
import * as React from "react";
import UpdateName from "@/components/table/account/update-name";
import UpdateValue from "@/components/table/account/update-value";
import Delete from "@/components/table/account/delete";
import { useAccounts } from "./provider";
import { Badge } from "@/components/ui/badge";

function IdBadge({ id }: { id: string }) {
  const { lastAction } = useAccounts();
  if (lastAction?.id === id) {
    return (
      <Badge variant="default" className="ml-2 uppercase">
        {lastAction.type}
      </Badge>
    );
  }

  return <></>;
}

function Row({ item }: { item: AccountItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        {item.id}
        <IdBadge id={item.id} />
      </TableCell>
      <TableCell>
        <UpdateName item={item} />
      </TableCell>
      <TableCell>
        <UpdateValue item={item} />
      </TableCell>
      <TableCell>
        <Delete item={item} />
      </TableCell>
    </TableRow>
  );
}

export default function AccountTableBody() {
  const { accounts } = useAccounts();
  return (
    <>
      {accounts.map((i) => (
        <Row item={i} key={i.id} />
      ))}
    </>
  );
}
