import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      {[2, 2, 3].map((i, index) => (
        <div key={index}>
          <Skeleton className="w-32 h-5 mb-2" />
          <div className="pl-6 -mb-1 -ml-1">
            {Array.from({ length: i }, (_, i) => i).map((j) => (
              <Skeleton key={index + "_" + j} className="w-32 h-5 mb-1 ml-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
