import { Skeleton } from "@/components/ui/skeleton";
import { BillList } from "./billList";
import { Suspense } from "@/lib/use-nav";
export default async function Page(props: {
  searchParams: Promise<{ category: string; account: string }>;
}) {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Skeleton className="w-20 h-5 bg-accent" />
              <Skeleton className="w-20 h-5 bg-accent" />
              <Skeleton className="w-20 h-5 bg-accent" />
              <Skeleton className="w-20 h-5 bg-accent" />
            </div>
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
