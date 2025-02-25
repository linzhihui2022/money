import { SkeletonGroup } from "@/components/ui/skeleton";
import RestockPage from "@/features/food/form/restock";
import { getFoods } from "api/food";
import { Suspense } from "react";

export default async function Page() {
  const foods = await getFoods();
  return (
    <Suspense fallback={<SkeletonGroup />}>
      <RestockPage foods={foods} />
    </Suspense>
  );
}
