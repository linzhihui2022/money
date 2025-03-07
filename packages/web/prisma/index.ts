import { PrismaClient } from "./client"

function singleton<Value>(name: string, value: () => Value): Value {
    const globalStore = global as unknown as {
        __singletons: {
            [k in typeof name]: Value
        }
    }
    globalStore.__singletons ??= {}
    globalStore.__singletons[name] ??= value()

    return globalStore.__singletons[name]
}

const prisma = singleton("prisma", () => new PrismaClient())
prisma.$connect()
export { prisma }
