import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategoriesQuery } from "@/lib/use-categories";
import { CategoryItem } from "types";
import UpdateValue from "@/components/table/category/update-value";
import Delete from "@/components/table/category/delete";

function CategoriesTableBody() {
  const { data } = useCategoriesQuery();
  return (
    <>
      {data.map((i) => (
        <Row item={i} key={i.id} />
      ))}
    </>
  );
}

function Row({ item }: { item: CategoryItem }) {
  return (
    <TableRow key={item.id}>
      <TableCell>{item.id}</TableCell>
      <TableCell>
        <UpdateValue item={item} />
      </TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>
        <Delete item={item} />
      </TableCell>
    </TableRow>
  );
}

export default function CategoryTable() {
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
        <CategoriesTableBody />
      </TableBody>
    </Table>
  );
}
