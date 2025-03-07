"use server"

import { Button } from "@/components/ui/button"
import { signOut } from "actions/auth"
import { LogOutIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const AuthLayout = async () => {
    const t = await getTranslations("auth")
    return (
        <form action={signOut}>
            <Button variant="ghost" size="icon">
                <span className="sr-only">{t("Sign out")}</span>
                <LogOutIcon />
            </Button>
        </form>
    )
}
