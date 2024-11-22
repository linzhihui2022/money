import { api } from "@/lib/api";
import { AccountItem } from "types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Money } from "@/components/ui/format";

export default async function Page() {
  const accounts = await api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }, ["account"]).then((res) => res.Items);

  return (
    <div className="px-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.id}</TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>
                <Money value={i.value} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
