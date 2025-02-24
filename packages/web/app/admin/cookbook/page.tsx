import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";

import CookbookList from "@/features/cookbook/ui/list";

export default async function Page() {
  return (
    <Suspense fallback={<SkeletonGroup />}>
      <CookbookList />
    </Suspense>
  );
}
