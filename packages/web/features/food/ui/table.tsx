"use server";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFoods } from "api/food";
import { FoodRow } from "@food/ui/row";

export default async function FoodTable() {
  const foods = await getFoods();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Type</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foods?.map((row) => <FoodRow row={row} key={row.id} />)}
      </TableBody>
    </Table>
  );
}
