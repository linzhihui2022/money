import { getCookbooks } from "api/cookbook";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CookbookRow } from "@cookbook/ui/row";
import { getTranslations } from "next-intl/server";

export default async function CookbookTable() {
  const cookbooks = await getCookbooks();
  const t = await getTranslations("cookbook");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>{t("Name")}</TableHead>
          <TableHead>{t("Food")}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cookbooks?.map((row) => <CookbookRow row={row} key={row.id} />)}
      </TableBody>
    </Table>
  );
}
