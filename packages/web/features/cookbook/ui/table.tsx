import { getCookbooks } from "api/cookbook";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CookbookRow } from "@cookbook/ui/row";

export default async function CookbookTable() {
  const cookbooks = await getCookbooks();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Food</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cookbooks?.map((row) => <CookbookRow row={row} key={row.id} />)}
      </TableBody>
    </Table>
  );
}
