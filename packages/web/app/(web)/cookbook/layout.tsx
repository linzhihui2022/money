import { LocaleToggle } from "@/components/locale-toggle"
import { ModeToggle } from "@/components/theme-toggle"

export default async function Layout() {
    return (
        <div className="relative flex min-h-dvh w-full flex-col">
            <header className="container flex items-center justify-between border-x border-dashed px-10 py-3">
                <div></div>
                <div className="flex items-center gap-2">
                    <LocaleToggle />
                    <ModeToggle />
                </div>
            </header>
            <div className="h-px w-full border-t border-dashed"></div>
            <main className="container flex-1 border-x border-dashed px-10 py-5"></main>
            <div className="h-px w-full border-t border-dashed"></div>
            <footer className="container border-x border-dashed px-10 py-5 text-xs">Lychee!</footer>
        </div>
    )
}
