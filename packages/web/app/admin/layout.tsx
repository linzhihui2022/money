"use server"

import { Footer } from "@/components/ui/footer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/app-sidebar"
import { Auth } from "@/features/auth"
import { checkAuth } from "@/lib/auth"
import React from "react"

import "./globals.css"

export default async function DashboardLayout({
    children,
    header,
}: {
    children: React.ReactNode
    header: React.ReactNode
}) {
    await checkAuth()
    return (
        <Auth>
            <SidebarProvider>
                <main className="flex w-full flex-row">
                    <AppSidebar />
                    <div className="no-scrollbar container flex min-h-dvh flex-col space-y-3 px-3 @container">
                        {header}
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </div>
                </main>
            </SidebarProvider>
        </Auth>
    )
}
