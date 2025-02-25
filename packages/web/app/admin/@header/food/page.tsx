import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { AddFoodDialog } from "@/features/food/ui/add-dialog";
import { ShoppingBasket } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page() {
  const t = await getTranslations("food");

  return (
    <Header>
      <AddFoodDialog />
      <Button size="icon" variant="ghost" asChild>
        <Link href="/admin/food/restock">
          <ShoppingBasket />
          <span className="sr-only">{t("Restock foods")}</span>
        </Link>
      </Button>
    </Header>
  );
}
