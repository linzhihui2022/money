import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CookbookHeader from "@/features/cookbook/ui/header";
import CookbookTable from "@/features/cookbook/ui/table";

export default async function Page() {
  return (
    <>
      <Header>
        <CookbookHeader />
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <CookbookTable />
      </Suspense>
    </>
  );
}
