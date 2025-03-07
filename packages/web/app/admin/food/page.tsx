import { SkeletonGroup } from "@/components/ui/skeleton"
import FoodTable from "@food/ui/table"
import { Suspense } from "react"

export default async function Page() {
    return (
        <Suspense fallback={<SkeletonGroup />}>
            <FoodTable />
        </Suspense>
    )
}
