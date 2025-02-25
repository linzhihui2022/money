import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Beef } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page() {
  const t = await getTranslations("sidebar");

  return (
    <Header>
      <Button size="icon" variant="ghost" asChild>
        <Link href="/admin/food">
          <Beef />
          <span className="sr-only">{t("Food list")}</span>
        </Link>
      </Button>
    </Header>
  );
}
