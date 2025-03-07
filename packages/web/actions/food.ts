"use server"

import { Food } from "@prisma-client"
import { prisma } from "@sb-prisma"
import { revalidateTag } from "next/cache"

export const updateFood = async (id: Food["id"], data: Pick<Food, "name" | "type" | "unit">) => {
    await prisma.food.update({ where: { id }, data })
    revalidateTag("foods")
    revalidateTag("cookbooks")
}
export const deleteFood = async (id: Food["id"]) => {
    await prisma.food.delete({ where: { id } })
    revalidateTag("foods")
    revalidateTag("cookbooks")
}

export const createFood = async (data: Pick<Food, "name" | "type">) => {
    await prisma.food.create({ data })
    revalidateTag("foods")
}

export const updateFoodsStock = async (data: { id: Food["id"]; stockIncrement: number }[]) => {
    await prisma.$transaction(
        data.map(({ id, stockIncrement }) => {
            return prisma.food.update({
                where: { id },
                data: { stock: { increment: stockIncrement } },
            })
        })
    )
    revalidateTag("foods")
    revalidateTag("cookbooks")
}
