import { UpdateCookbook } from "@/features/cookbook/form/update"
import { getCookbook } from "api/cookbook"
import { getFoods } from "api/food"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const cookbook = await getCookbook(+id)
    const foods = await getFoods()

    return <UpdateCookbook cookbook={cookbook} foods={foods} />
}
