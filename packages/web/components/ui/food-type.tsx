"use client"

import { cn } from "@/lib/utils"
import { FoodType } from "@prisma-client"
import { useTranslations } from "next-intl"

export const foodTypeColorMap: Record<FoodType, string> = {
    [FoodType.SEAFOOD]: "text-foodtype-seafood",
    [FoodType.VEGETABLE]: "text-foodtype-vegetable",
    [FoodType.MEET]: "text-foodtype-meet",
    [FoodType.FRUIT]: "text-foodtype-fruit",
    [FoodType.OTHER]: "text-foodtype-other",
}
export const foodTypeHslColorMap: Record<FoodType, string> = {
    [FoodType.SEAFOOD]: "hsl(var(--foodtype-seafood))",
    [FoodType.VEGETABLE]: "hsl(var(--foodtype-vegetable))",
    [FoodType.MEET]: "hsl(var(--foodtype-meet))",
    [FoodType.FRUIT]: "hsl(var(--foodtype-fruit))",
    [FoodType.OTHER]: "hsl(var(--foodtype-other))",
}
export function FoodTypeCircle({ type, label = true }: { type: FoodType; label?: boolean }) {
    const t = useTranslations("food.FoodType")
    return (
        <span className="inline-flex items-center space-x-1">
            <svg
                className={cn(foodTypeColorMap[type], "stroke-primary")}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M4 4a16 16 0 0 1 16 16 L4 20 L4 4" fill="currentColor" />
            </svg>
            {label && <span>{t(type)}</span>}
        </span>
    )
}
