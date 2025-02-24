import { SkeletonGroup } from "@/components/ui/skeleton";
import { UpdateCookbook } from "@/features/cookbook/form/update";
import { getCookbook } from "api/cookbook";
import { getFoods } from "api/food";

import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const cookbook = await getCookbook(+id);
  const foods = await getFoods();

  return (
    <Suspense fallback={<SkeletonGroup />}>
      <UpdateCookbook cookbook={cookbook} foods={foods} />
    </Suspense>
  );
}
