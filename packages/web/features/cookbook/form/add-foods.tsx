"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FoodTypeCircle } from "@/components/ui/food-type"
import { Input } from "@/components/ui/input"
import { Food } from "@prisma-client"
import { Cross1Icon } from "@radix-ui/react-icons"
import { Plus } from "lucide-react"
import { useState } from "react"

import { FoodCombobox } from "../form/add-food-combobox"

export function AddFoods({
    foods,
    value,
    setValueAction,
}: {
    foods: Food[]
    value: { quantity: number; food: number }[]
    setValueAction: (pre: { quantity: number; food: number }[]) => void
}) {
    const [foodId, setFoodId] = useState(0)
    const [quantity, setQuantity] = useState(0)
    return (
        <div className="space-y-2">
            <div>
                <FoodCombobox foods={foods} value={foodId} setValue={setFoodId} />
            </div>
            <div className="flex flex-1 items-center space-x-2">
                <Input value={quantity} onChange={(e) => setQuantity(+e.target.value || 0)} type="number" />
                <Button
                    disabled={!quantity || !foodId}
                    size="lg"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                        const _value = [...value]
                        const index = _value.findIndex((i) => i.food === foodId)
                        if (index > -1) {
                            const cur = _value[index]
                            _value.splice(index, 1, {
                                quantity: Math.max(cur.quantity + quantity, 0),
                                food: cur.food,
                            })
                        } else {
                            _value.push({ quantity, food: foodId })
                        }
                        setValueAction([..._value].filter((i) => i.quantity > 0))
                        setFoodId(0)
                    }}>
                    <Plus />
                </Button>
            </div>
        </div>
    )
}

export function FoodsDescription({
    foods,
    value,
    setValueAction,
}: {
    foods: Food[]
    value: { quantity: number; food: number }[]
    setValueAction: (pre: { quantity: number; food: number }[]) => void
}) {
    if (!value.length) return <></>
    return (
        <div className="-mx-2 -my-1 flex flex-wrap">
            {value.map(({ food, quantity }, index) => {
                const item = foods.find((i) => i.id === food)
                if (!item) return <></>
                return (
                    <Badge variant="secondary" className="mx-2 my-1 text-xs" key={item.id}>
                        <div className="flex items-center">
                            <div className="flex space-x-2">
                                <FoodTypeCircle label={false} type={item.type} />
                                <span>
                                    {item.name} {quantity}
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            className="pl-2 pr-0"
                            size="sm"
                            onClick={() => {
                                const _value = [...value]
                                _value.splice(index, 1)
                                setValueAction(_value)
                            }}>
                            <Cross1Icon />
                        </Button>
                    </Badge>
                )
            })}
        </div>
    )
}
