import { FoodTypeCircle } from "@/components/ui/food-type"
import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FoodType } from "@prisma-client"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ComponentPropsWithoutRef } from "react"

export const FoodTypeSelect = (props: ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) => (
    <Select {...props}>
        <FormControl>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
        </FormControl>
        <SelectContent>
            <SelectItem value={FoodType.MEET}>
                <FoodTypeCircle type={FoodType.MEET} />
            </SelectItem>
            <SelectItem value={FoodType.VEGETABLE}>
                <FoodTypeCircle type={FoodType.VEGETABLE} />
            </SelectItem>
            <SelectItem value={FoodType.SEAFOOD}>
                <FoodTypeCircle type={FoodType.SEAFOOD} />
            </SelectItem>
            <SelectItem value={FoodType.FRUIT}>
                <FoodTypeCircle type={FoodType.FRUIT} />
            </SelectItem>
            <SelectItem value={FoodType.OTHER}>
                <FoodTypeCircle type={FoodType.OTHER} />
            </SelectItem>
        </SelectContent>
    </Select>
)
