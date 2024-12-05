import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountItem } from "types";
import UpdateName from "../table/update-name";
import UpdateValue from "../table/update-value";
import Delete from "../table/delete";
import { api } from "@/lib/api";

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

async function AccountTableBody() {
  const data = await api<{ Count: number; Items: AccountItem[] }>({
    uri: "/accounts",
    next: { tags: ["accounts"] },
  }).then((res) => res.data?.Items || []);
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
