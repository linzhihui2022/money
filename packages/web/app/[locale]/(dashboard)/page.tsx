import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<SkeletonGroup />}></Suspense>
    </>
  );
}
