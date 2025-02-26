import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page() {
  const t = await getTranslations("task");
  return (
    <Header>
      <Button size="icon" variant="ghost" asChild>
        <Link href="/admin/task/create">
          <Plus />
          <span className="sr-only">{t("Add new task")}</span>
        </Link>
      </Button>
    </Header>
  );
}
