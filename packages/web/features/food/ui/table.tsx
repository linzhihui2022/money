import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFoods } from "api/food";
import { FoodRow } from "@food/ui/row";
import { getTranslations } from "next-intl/server";

export default async function FoodTable() {
  const foods = await getFoods();
  const t = await getTranslations("food");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>{t("Name")}</TableHead>
          <TableHead>{t("Unit")}</TableHead>
          <TableHead>{t("Type")}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foods?.map((row) => <FoodRow row={row} key={row.id} />)}
      </TableBody>
    </Table>
  );
}
