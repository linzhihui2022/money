import { PropsWithChildren } from "react";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "i18n/routing";
import { HomeIcon } from "lucide-react";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="border-b sticky top-0 z-10 bg-background py-3 h-15 shrink-0 overflow-hidden flex items-center">
      <Button asChild variant="ghost" size="icon">
        <Link href="/">
          <HomeIcon />
        </Link>
      </Button>
      <SidebarTrigger />
      <ModeToggle />
      <Separator orientation="vertical" className="h-6 last:hidden mx-1" />
      {children}
    </header>
  );
}
