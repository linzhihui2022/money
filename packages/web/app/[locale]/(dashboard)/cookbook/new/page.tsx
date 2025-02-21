import { getFoods } from "api/food";
import { CreateCookbook } from "@cookbook/form/create";
import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "i18n/routing";
import { Book } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const foods = await getFoods();
  const t = await getTranslations("sidebar");

  return (
    <>
      <Header>
        <Button size="icon" variant="ghost" asChild>
          <Link href="/cookbook">
            <Book />
            <span className="sr-only">{t("Cookbook list")}</span>
          </Link>
        </Button>
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <CreateCookbook foods={foods} />
      </Suspense>
    </>
  );
}
