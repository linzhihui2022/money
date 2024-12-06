import CategoryTable from "@/features/category/ui/table";
import CategoryHeader from "@/features/category/ui/header";
import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Header>
        <CategoryHeader />
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <CategoryTable />
      </Suspense>
    </>
  );
}
