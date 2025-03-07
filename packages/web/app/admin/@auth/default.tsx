import { checkAuth } from "@/lib/auth"

export default async function DefaultHeader() {
    await checkAuth()
    return <></>
}
