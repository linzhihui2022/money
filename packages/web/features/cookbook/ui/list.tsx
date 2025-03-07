import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FoodTypeCircle } from "@/components/ui/food-type"
import { getCookbooks } from "api/cookbook"
import { getFoods } from "api/food"
import Link from "next/link"

import { AiSeesion } from "./AiSession"

export default async function CookbookList() {
    const cookbooks = await getCookbooks()
    const foods = await getFoods()

    return (
        <ul className="grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3 @8xl:grid-cols-4">
            {cookbooks.map((cookbook) => (
                <li key={cookbook.id}>
                    <Card className="relative h-full transition-transform hover:-translate-y-1 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle>
                                <Link href={`/admin/cookbook/${cookbook.id}`}>
                                    {cookbook.name}
                                    <span className="absolute inset-0" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="-mb-1 -mr-2">
                                {cookbook.items.map(({ food, quantity, id }) => {
                                    const item = foods.find((i) => i.id === food.id)
                                    if (!item) return <></>
                                    return (
                                        <div className="mb-1 mr-2 text-xs" key={id}>
                                            <div className="flex items-center">
                                                <div className="flex">
                                                    <FoodTypeCircle label={false} type={item.type} />
                                                    <span>
                                                        {item.name} {quantity}
                                                        {item.unit}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AiSeesion content={cookbook.content} />
                        </CardContent>
                    </Card>
                </li>
            ))}
        </ul>
    )
}
