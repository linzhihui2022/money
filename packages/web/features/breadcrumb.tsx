import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export default function Breadcrumb({
  children,
  page,
}: PropsWithChildren<{ page: "Category" | "Account" }>) {
  const list = [
    { href: "/category", page: "Category" },
    { href: "/account", page: "Account" },
  ] as const;
  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Bill</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {page}
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {list.map((item) => (
                <DropdownMenuItem key={item.page}>
                  <BreadcrumbLink href={item.href}>{item.page}</BreadcrumbLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        {children ? <BreadcrumbSeparator /> : <></>}
        {children}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
