import FoodTable from "@/features/food/ui/table";
import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import FoodHeader from "@/features/food/ui/header";

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
