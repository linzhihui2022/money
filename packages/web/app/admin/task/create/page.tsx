import { SkeletonGroup } from "@/components/ui/skeleton";
import CreateTask from "@/features/task/form/create";
import { getCookbooks } from "api/cookbook";
import { getAvailableFoods } from "api/food";
import { Suspense } from "react";

export default async function Page() {
  const foods = await getAvailableFoods();
  const cookbooks = await getCookbooks();
  return (
    <Suspense fallback={<SkeletonGroup />}>
      <CreateTask
        foods={foods.reduce((pre, cur) => ({ ...pre, [cur.id]: cur }), {})}
        cookbooks={cookbooks}
      />
    </Suspense>
  );
}
