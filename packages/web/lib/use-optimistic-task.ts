import { isAfter } from "date-fns"
import { useOptimistic } from "react"

import type { Task } from "./use-task-panel"

export type TaskAction<T> =
    | { type: "delete"; taskId: number }
    | { type: "move"; taskId: number; date: Date }
    | { type: "add"; task: T }
    | { type: "upload"; taskId: number; path: string; key: string }
    | { type: "removeImage"; imageKey: string }
    | { type: "archive"; taskId: number }
    | { type: "unarchive"; taskId: number }

const sortByDate = <T extends { date: Date }>(tasks: T[]) => tasks.sort((a, b) => (isAfter(a.date, b.date) ? 1 : -1))

export const useOptimisticTask = <T extends Pick<Task, "id" | "date" | "taskImage">>(
    initialTasks: T[]
): [T[], (action: TaskAction<T>) => void] =>
    useOptimistic(initialTasks, (state, action: TaskAction<T>) => {
        switch (action.type) {
            case "move":
                return sortByDate(
                    state.map((task) => ({
                        ...task,
                        ...(task.id === action.taskId && { date: action.date }),
                    }))
                )
            case "delete":
                return sortByDate(state.filter((task) => task.id !== action.taskId))
            case "add":
                return sortByDate([...state, action.task])
            case "upload":
                return sortByDate(
                    state.map((task) => ({
                        ...task,
                        ...(task.id === action.taskId && {
                            taskImage: [
                                ...task.taskImage,
                                {
                                    key: action.key,
                                    url: action.path,
                                    uploading: true,
                                },
                            ],
                        }),
                    }))
                )
            case "removeImage":
                return sortByDate(
                    state.map((task) => ({
                        ...task,
                        taskImage: task.taskImage.filter((image) => image.key !== action.imageKey),
                    }))
                )
            case "archive":
                return sortByDate(
                    state.map((task) => ({
                        ...task,
                        ...(task.id === action.taskId && { archive: true }),
                    }))
                )
            case "unarchive":
                return sortByDate(
                    state.map((task) => ({
                        ...task,
                        ...(task.id === action.taskId && { archive: false }),
                    }))
                )
            default:
                return state
        }
    })
