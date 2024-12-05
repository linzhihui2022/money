import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/features/bill/ui/header";
import { BillList } from "@/features/bill/ui/list";
import { getQuery } from "@/lib/query";
import { Suspense } from "@/lib/use-nav";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category: string; account: string }>;
}) {
  const query = await getQuery({ searchParams });
  return (
    <>
      <Header query={query} />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-y-2">
            <Skeleton className="w-full h-5 bg-accent" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5 bg-accent" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5 bg-accent" />
            <Skeleton className="w-full h-5" />
          </div>
        }
      >
        <BillList query={query} />
      </Suspense>
    </>
  );
}
