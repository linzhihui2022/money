import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryItem } from "types";
import { CategoriesProvider } from "./provider";
import CategoriesTableBody from "./row";

export default function CategoryTable({
  categories,
  lastAction,
}: {
  categories: CategoryItem[];
  lastAction: { type: "new" | "updated"; id: string } | null;
}) {
  return (
    <CategoriesProvider categories={categories} lastAction={lastAction}>
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
          <CategoriesTableBody />
        </TableBody>
      </Table>
    </CategoriesProvider>
  );
}
