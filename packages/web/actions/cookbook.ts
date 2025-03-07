"use server"

import { Cookbook, CookbookItem, Food, Prisma } from "@prisma-client"
import { prisma } from "@sb-prisma"
import { revalidateTag } from "next/cache"
import { v4 } from "uuid"

import { AI } from "../ai/help"
import { cookbookPrompt } from "../ai/prompt"
import { CookbookContent, DeepseekModel, KimiModel } from "../ai/type"

export const createCookbook = async (
    name: string,
    items: { quantity: number; food: number }[],
    content: CookbookContent
) => {
    await prisma.cookbook.create({
        data: {
            name,
            content,
            items: {
                create: items.map((i) => ({
                    quantity: i.quantity,
                    food: { connect: { id: i.food } },
                })),
            },
        },
    })
    revalidateTag("cookbooks")
}

export const deleteCookbook = async (id: number) => {
    await prisma.cookbook.delete({ where: { id } })
    revalidateTag("cookbooks")
}

export const updateCookbook = async (id: Food["id"], data: Prisma.CookbookUpdateArgs["data"]) => {
    await prisma.cookbook.update({ where: { id }, data })
    revalidateTag("cookbooks")
}

export const updateCookbookContent = async (id: Food["id"], data: Pick<Cookbook, "content">) => {
    await prisma.cookbook.update({
        where: { id },
        data,
    })
    revalidateTag("cookbooks")
}

export const updateCookbookItem = async (id: CookbookItem["id"], data: Pick<CookbookItem, "foodId" | "quantity">) => {
    await prisma.cookbookItem.update({ where: { id }, data })
    revalidateTag("cookbooks")
}

export const deleteCookbookItem = async (id: number) => {
    await prisma.cookbookItem.delete({ where: { id } })
    revalidateTag("cookbooks")
}

export const createCookbookItem = async (
    cookbookId: number,
    {
        quantity,
        food,
    }: {
        quantity: number
        food: number
    }
) => {
    await prisma.cookbookItem.create({
        data: {
            quantity,
            food: { connect: { id: food } },
            cookbook: { connect: { id: cookbookId } },
        },
    })
    revalidateTag("cookbooks")
}

export const aiCookbook = async (
    model: KimiModel | DeepseekModel,
    cookbook: string,
    foods: { name: string; unit: string; quantity: number }[]
) =>
    new AI(model)
        .fetch<CookbookContent>(cookbookPrompt, JSON.stringify({ foods, cookbook }))
        .then(({ data, price }) => ({
            price,
            data: { ...data, steps: data.steps.map((i) => ({ ...i, key: v4() })) },
        }))
