import FoodTable from "@/features/food/ui/table";
import FoodHeader from "@/features/food/ui/header";
import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Header>
        <FoodHeader />
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <FoodTable />
      </Suspense>
    </>
  );
}
