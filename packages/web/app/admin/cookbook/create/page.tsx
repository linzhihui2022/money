import { CreateCookbook } from "@cookbook/form/create"
import { getFoods } from "api/food"

export default async function Page() {
    const foods = await getFoods()
    return <CreateCookbook foods={foods} />
}
