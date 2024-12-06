import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}
function SkeletonGroup({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 gap-y-2", className)} {...props}>
      <Skeleton className="w-full h-5 bg-accent" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5 bg-accent" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5 bg-accent" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5" />
    </div>
  );
}
export { Skeleton, SkeletonGroup };
