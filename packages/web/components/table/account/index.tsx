import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountItem } from "types";
import AccountTableBody from "./row";
import { AccountsProvider } from "./provider";

export default async function AccountTable({
  accounts,
  lastAction,
}: {
  accounts: AccountItem[];
  lastAction: { type: "new" | "updated"; id: string } | null;
}) {
  return (
    <AccountsProvider accounts={accounts} lastAction={lastAction}>
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
    </AccountsProvider>
  );
}
