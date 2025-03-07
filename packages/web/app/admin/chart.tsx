"use client"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { foodTypeHslColorMap } from "@/components/ui/food-type"
import { $Enums } from "@prisma-client"
import { getFoodsType } from "api/food"
import { useTranslations } from "next-intl"
import { Label, Pie, PieChart } from "recharts"

import FoodType = $Enums.FoodType

export const Chart = ({ foodsType }: { foodsType: Awaited<ReturnType<typeof getFoodsType>> }) => {
    const chartData = foodsType.data.map((item) => ({
        ...item,
        fill: foodTypeHslColorMap[item.type],
    }))
    const t = useTranslations("food")

    return (
        <ChartContainer
            config={{
                [FoodType.SEAFOOD]: { label: t(`FoodType.${FoodType.SEAFOOD}`) },
                [FoodType.VEGETABLE]: {
                    label: t(`FoodType.${FoodType.VEGETABLE}`),
                },
                [FoodType.MEET]: { label: t(`FoodType.${FoodType.MEET}`) },
                [FoodType.FRUIT]: { label: t(`FoodType.${FoodType.FRUIT}`) },
                [FoodType.OTHER]: { label: t(`FoodType.${FoodType.OTHER}`) },
            }}
            className="aspect-square mx-auto h-[250px]">
            <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <ChartLegend
                    content={<ChartLegendContent nameKey="type" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
                <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold">
                                            {foodsType.total}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground">
                                            {t("Name")}
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}
