import { PropsWithChildren } from "react";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="border-b sticky top-0 z-10 bg-background py-3 h-15 shrink-0 overflow-hidden flex items-center">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      {children}
    </header>
  );
}
