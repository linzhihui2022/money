import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }, (_, i) => i).map((i) => (
        <Skeleton key={i} className="w-40 h-5 mb-1 ml-1" />
      ))}
    </div>
  );
}
