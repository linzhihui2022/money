"use server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateName from "../table/update-name";
import Delete from "../table/delete";
import { getFoods } from "../../../api/food";

export default async function FoodTable() {
  const foods = await getFoods();

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
        {foods?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>
              <UpdateName item={item} />
            </TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>
              <Delete item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
