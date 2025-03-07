import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { Auth } from "@/features/auth"

import "../globals.css"

export default function QuickLayout({ children }: { children: React.ReactNode }) {
    return (
        <Auth>
            <main className="flex w-full flex-row">
                <div className="no-scrollbar mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col space-y-3 px-3 @container">
                    <Header />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </div>
            </main>
        </Auth>
    )
}
