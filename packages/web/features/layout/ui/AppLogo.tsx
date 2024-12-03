import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppLogo({
  className,
  theme = "header",
}: {
  className?: string;
  theme?: "header" | "sidebar";
}) {
  // todo @coco logo

  if (theme === "sidebar") {
    return (
      <div className={className} style={{ width: SIDEBAR_WIDTH }}>
        logo
      </div>
    );
  }
  return (
    <div className="w-auto">
      <div
        className={cn("max-lg:hidden flex h-full items-center", className)}
        style={{ width: SIDEBAR_WIDTH }}
      >
        logo
      </div>
      <div
        className="flex lg:hidden h-full items-center"
        style={{ width: SIDEBAR_WIDTH_ICON }}
      >
        <SidebarTrigger />
      </div>
    </div>
  );
}
