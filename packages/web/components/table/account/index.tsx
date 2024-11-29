import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountItem } from "types";
import Row from "./row";

export default function AccountTable({
  accounts,
}: {
  accounts: AccountItem[];
}) {
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
        {accounts.map((i) => (
          <Row item={i} key={i.id} />
        ))}
      </TableBody>
    </Table>
  );
}
