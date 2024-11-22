import { api } from "@/lib/api";
import { CategoryItem } from "types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
  const categories = await api<{ Count: number; Items: CategoryItem[] }>({ uri: "/category" }, ["category"]).then((res) => res.Items);
  return (
    <div className="px-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.id}</TableCell>
              <TableCell>{i.value}</TableCell>
              <TableCell>{i.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
