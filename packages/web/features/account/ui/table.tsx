import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateName from "../table/update-name";
import UpdateValue from "../table/update-value";
import Delete from "../table/delete";
import { getAccounts } from "api/account";

export default async function AccountTable() {
  const accounts = await getAccounts();

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
        {accounts.map((item) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
