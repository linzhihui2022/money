import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CookbookTable from "@cookbook/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "i18n/routing";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

export default async function Page() {
  const t = await getTranslations("cookbook");
  return (
    <>
      <Header>
        <Button size="icon" variant="ghost" asChild>
          <Link href="/cookbook/new">
            <Plus />
            <span className="sr-only">{t("Add new cookbook")}</span>
          </Link>
        </Button>
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <CookbookTable />
      </Suspense>
    </>
  );
}
