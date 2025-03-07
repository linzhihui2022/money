import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PendingProvider } from "@/lib/use-nav"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
import Head from "next/head"
import { ReactNode } from "react"

import { getUserLocale } from "../i18n/cookies"

export async function generateMetadata() {
    const locale = await getLocale()
    const t = await getTranslations({ locale, namespace: "layout" })
    return {
        title: t("title"),
        description: t("description"),
    }
}
export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getUserLocale()
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
            </Head>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <TooltipProvider>
                        <NextIntlClientProvider messages={messages}>
                            <PendingProvider>
                                {children}
                                <Toaster />
                            </PendingProvider>
                        </NextIntlClientProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
