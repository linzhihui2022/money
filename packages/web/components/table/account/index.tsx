import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/components/ui/format";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AccountItem } from "types";

export default function AccountTable({ accounts, newItem }: { accounts: AccountItem[]; newItem: string | undefined }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts
          .sort((i) => (i.id === newItem ? -1 : 1))
          .map((i) => (
            <TableRow key={i.id}>
              <TableCell>
                {i.id}
                {i.id === newItem && (
                  <Badge variant="default" className="ml-2">
                    new
                  </Badge>
                )}
              </TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>
                <Money value={i.value} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Update value</DropdownMenuItem>
                    <DropdownMenuItem>Update name</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
