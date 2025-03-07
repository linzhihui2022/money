"use client"

import { Link } from "@/lib/use-nav"
import { cn } from "@/lib/utils"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import * as React from "react"

const Checkbox = React.forwardRef<
    React.ComponentRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
        )}
        {...props}>
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <CheckIcon className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxLink = ({ state, href, children }: React.PropsWithChildren<{ state: boolean; href: string }>) => {
    const [checked, onClick] = React.useOptimistic<boolean, "click">(state, (v) => !v)
    return (
        <Link className="flex items-center space-x-2 space-y-0 py-1" href={href} onClick={() => onClick("click")}>
            <Checkbox checked={checked} />
            <label className="cursor-pointer text-sm font-normal">{children}</label>
        </Link>
    )
}
CheckboxLink.displayName = "CheckboxLink"

export { Checkbox, CheckboxLink }
