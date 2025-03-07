import { SkeletonGroup } from "@/components/ui/skeleton"
import { CreateCookbook } from "@cookbook/form/create"
import { getFoods } from "api/food"
import { Suspense } from "react"

export default async function Page() {
    const foods = await getFoods()
    return (
        <Suspense fallback={<SkeletonGroup />}>
            <CreateCookbook foods={foods} />
        </Suspense>
    )
}
