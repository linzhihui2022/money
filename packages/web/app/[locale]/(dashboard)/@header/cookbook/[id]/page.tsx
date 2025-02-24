import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import Delete from "@/features/cookbook/table/delete";
import { Link } from "i18n/routing";
import { Book } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const t = await getTranslations("sidebar");

  return (
    <Header>
      <Button size="icon" variant="ghost" asChild>
        <Link href="/cookbook">
          <Book />
          <span className="sr-only">{t("Cookbook list")}</span>
        </Link>
      </Button>
      <Delete id={id} />
    </Header>
  );
}
