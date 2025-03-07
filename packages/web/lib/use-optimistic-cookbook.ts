import type { Cookbook } from "@prisma-client"
import { useOptimistic } from "react"

const sortById = <T extends { id: number }>(tasks: T[]) => tasks.sort((a, b) => ((a.id, b.id) ? 1 : -1))

export type CookbookAction<T> = { type: "release"; cookbook: T }

export const useOptimisticCookbook = <T extends Pick<Cookbook, "id">>(
    initialCookbooks: T[]
): [T[], (action: CookbookAction<T>) => void] =>
    useOptimistic(initialCookbooks, (state, action: CookbookAction<T>) => {
        switch (action.type) {
            case "release":
                if (!action.cookbook) return state
                if (state.find((c) => c.id === action.cookbook?.id)) return state
                return sortById([...state, action.cookbook])
            default:
                return state
        }
    })
