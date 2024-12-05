import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountItem } from "types";
import UpdateName from "@/components/table/account/update-name";
import UpdateValue from "@/components/table/account/update-value";
import Delete from "@/components/table/account/delete";
import { useAccountsQuery } from "@/lib/use-accounts";

function Row({ item }: { item: AccountItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>{item.id}</TableCell>
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

function AccountTableBody() {
  const { data } = useAccountsQuery();

  return (
    <>
      {data.map((i) => (
        <Row item={i} key={i.id} />
      ))}
    </>
  );
}

export default function AccountTable() {
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
        <AccountTableBody />
      </TableBody>
    </Table>
  );
}
