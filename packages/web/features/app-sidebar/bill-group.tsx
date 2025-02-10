"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Cat, CreditCard, Receipt, Settings, Beef } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function BillMenuGroup() {
  const pathname = usePathname();
  const menu = [
    {
      pathname: "/account",
      Icon: CreditCard,
      name: "Account",
    },
    {
      pathname: "/category",
      Icon: Cat,
      name: "Category",
    },
    {
      pathname: "/food",
      Icon: Beef,
      name: "Food",
    },
  ];
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/"} asChild>
            <Link href="/">
              <Receipt />
              <span>Bill list</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="font-normal rounded-md p-2 hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <div className="flex items-center gap-x-2 h-4">
                <Settings className="w-4 h-4" /> <span>Bill Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 grid grid-cols-1 gap-y-1 my-1 pb-0">
              {menu.map((group) => (
                <SidebarMenuItem key={group.pathname}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(group.pathname)}
                    asChild
                  >
                    <Link href={group.pathname}>
                      <group.Icon />
                      <span>{group.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenu>
    </>
  );
}
