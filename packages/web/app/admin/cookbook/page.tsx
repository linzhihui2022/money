import { SkeletonGroup } from "@/components/ui/skeleton"
import CookbookList from "@/features/cookbook/ui/list"
import { Suspense } from "react"

export default async function Page() {
    return (
        <Suspense fallback={<SkeletonGroup />}>
            <CookbookList />
        </Suspense>
    )
}
