import { Skeleton } from "@/components/ui/skeleton";
import BillHeader from "@/features/bill/ui/BillHeader";
import { BillList } from "@/features/bill/ui/BillList";
import { Suspense } from "@/lib/use-nav";

export default async function Page(props: {
  searchParams: Promise<{ category: string; account: string }>;
}) {
  return (
    <div>
      <BillHeader searchParams={props.searchParams} />
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
        <BillList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
