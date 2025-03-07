"use client"

import { Button } from "@/components/ui/button"
import { locales } from "i18n/locales"
import { LanguagesIcon } from "lucide-react"
import { useLocale } from "next-intl"
import { useTransition } from "react"

import { setUserLocale } from "../i18n/cookies"

export const LocaleToggle = () => {
    const currentLocale = useLocale()

    const [, startTransition] = useTransition()
    function toggleLang() {
        startTransition(() => {
            const index = locales.indexOf(currentLocale as (typeof locales)[number])
            setUserLocale(index === locales.length - 1 ? locales[0] : locales[index + 1])
        })
    }

    return (
        <Button variant="ghost" size="icon" onClick={() => toggleLang()}>
            <LanguagesIcon />
        </Button>
    )
}
