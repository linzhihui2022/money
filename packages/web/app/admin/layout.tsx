import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import React from "react"

export default async function DashboardLayout({
    children,
    header,
    auth,
}: {
    children: React.ReactNode
    header: React.ReactNode
    auth: React.ReactNode
}) {
    return (
        <main className="flex w-full flex-row">
            {auth}
            <div className="no-scrollbar container flex min-h-dvh flex-col space-y-3 px-3 @container">
                <Header>{header}</Header>
                <div className="flex-1">{children}</div>
                <Footer />
            </div>
        </main>
    )
}
