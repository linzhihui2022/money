"use server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryItem } from "types";
import UpdateValue from "../table/update-value";
import Delete from "../table/delete";
import { api } from "@/lib/api";

async function CategoriesTableBody() {
  const data = await api<{ Count: number; Items: CategoryItem[] }>({
    uri: "/category",
    next: { tags: ["categories"] },
  }).then((res) => res.data?.Items);
  return <>{data?.map((i) => <Row item={i} key={i.id} />)}</>;
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

export default async function CategoryTable() {
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
