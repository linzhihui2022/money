import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Link } from "i18n/routing";
import { Book } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("sidebar");

  return (
    <Header>
      <Button size="icon" variant="ghost" asChild>
        <Link href="/cookbook">
          <Book />
          <span className="sr-only">{t("Cookbook list")}</span>
        </Link>
      </Button>
    </Header>
  );
}
