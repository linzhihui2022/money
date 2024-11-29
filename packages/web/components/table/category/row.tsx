"use server";
import { TableCell, TableRow } from "@/components/ui/table";
import { Money } from "@/components/ui/format";
import { AccountItem } from "types";
import * as React from "react";
import UpdateName from "@/components/table/account/update-name";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import IdBadge from "@/components/table/id-badge";
import UpdateValue from "@/components/table/account/update-value";

export default async function Row({ item }: { item: AccountItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        {item.id}
        <IdBadge id={item.id} />
      </TableCell>
      <TableCell>
        <UpdateName
          trigger={
            <Button variant="link" className="group">
              <span>{item.name}</span>
              <Edit className="group-hover:opacity-100 opacity-0" />
            </Button>
          }
          title={`Edit name of <${item.name}>`}
          item={item}
        />
      </TableCell>
      <TableCell>
        <UpdateValue
          title={`Edit value of <${item.name}>`}
          item={item}
          trigger={
            <Button variant="link" className="group">
              <Money value={item.value} />
              <Edit className="group-hover:opacity-100 opacity-0" />
            </Button>
          }
        />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
