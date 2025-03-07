import { CookbookContent } from "../ai/type"

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PrismaJson {
        type CookbookContentType = CookbookContent
    }
}
