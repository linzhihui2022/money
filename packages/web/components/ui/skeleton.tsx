import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
}
function SkeletonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("grid grid-cols-1 gap-y-2", className)} {...props}>
            <Skeleton className="h-5 w-full bg-accent" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full bg-accent" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full bg-accent" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
        </div>
    )
}
export { Skeleton, SkeletonGroup }
