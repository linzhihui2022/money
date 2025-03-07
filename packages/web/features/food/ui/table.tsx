import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FoodRow } from "@food/ui/row"
import { getFoods } from "api/food"
import { getTranslations } from "next-intl/server"

export default async function FoodTable() {
    const foods = await getFoods()
    const t = await getTranslations("food")
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead>{t("Type")}</TableHead>
                    <TableHead>{`${t("Stock")}/${t("Unit")}`}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{foods?.map((row) => <FoodRow row={row} key={row.id} />)}</TableBody>
        </Table>
    )
}
