import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryItem } from "types";
import Row from "./row";

export default function CategoryTable({
  categories,
}: {
  categories: CategoryItem[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((i) => (
          <Row item={i} key={i.id} />
        ))}
      </TableBody>
    </Table>
  );
}
