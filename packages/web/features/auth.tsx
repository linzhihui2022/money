"use server"

import { Button } from "@/components/ui/button"
import { signOut } from "actions/auth"
import { getUser } from "api/auth"
import { LogOutIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const AuthLayout = async () => {
    const t = await getTranslations("auth")
    const user = await getUser()
    if (!user.data.user) return null
    return (
        <form action={signOut}>
            <Button variant="ghost" size="icon">
                <span className="sr-only">{t("Sign out")}</span>
                <LogOutIcon />
            </Button>
        </form>
    )
}
