import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CookbookHeader from "@cookbook/ui/header";
import CookbookTable from "@cookbook/ui/table";

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
