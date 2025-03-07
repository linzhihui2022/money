import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppLogo({ className, theme = "header" }: { className?: string; theme?: "header" | "sidebar" }) {
    // todo @coco logo

    if (theme === "sidebar") {
        return (
            <div className={className} style={{ width: SIDEBAR_WIDTH }}>
                💰
            </div>
        )
    }
    return (
        <div className="w-auto">
            <div className={cn("flex h-full items-center max-lg:hidden", className)} style={{ width: SIDEBAR_WIDTH }}>
                💰
            </div>
            <div className="flex h-full items-center lg:hidden" style={{ width: SIDEBAR_WIDTH_ICON }}>
                <SidebarTrigger />
            </div>
        </div>
    )
}
