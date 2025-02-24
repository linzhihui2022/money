import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Link } from "i18n/routing";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("cookbook");
  return (
    <Header>
      <Button size="icon" variant="ghost" asChild>
        <Link href="/cookbook/create">
          <Plus />
          <span className="sr-only">{t("Add new cookbook")}</span>
        </Link>
      </Button>
    </Header>
  );
}
