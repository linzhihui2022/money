import { PropsWithChildren } from "react";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, LayoutDashboardIcon } from "lucide-react";
import { LocaleToggle } from "../locale-toggle";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="border-b sticky top-0 z-10 bg-background py-3 shrink-0 overflow-hidden flex items-center -mx-3 px-3">
      <Button asChild variant="ghost" size="icon">
        <Link href="/">
          <Home />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon">
        <Link href="/admin">
          <LayoutDashboardIcon />
        </Link>
      </Button>
      <SidebarTrigger />
      <ModeToggle />
      <LocaleToggle />
      <Separator orientation="vertical" className="h-6 last:hidden mx-1" />
      {children}
    </header>
  );
}
