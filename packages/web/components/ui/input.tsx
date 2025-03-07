import { Money } from "@/components/ui/format"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import * as React from "react"
import { ComponentProps } from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

const MoneyInput = React.forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(({ className, ...props }, ref) => (
    <div className="relative">
        <Input className={cn("pr-20", className)} ref={ref} {...props}></Input>
        {!!props.value && (
            <Label
                htmlFor={props.id}
                className="absolute bottom-0 right-0 top-0 flex h-10 items-center justify-end rounded-r-md bg-input px-3 py-2 text-sm">
                <Money value={+props.value} />
            </Label>
        )}
    </div>
))
MoneyInput.displayName = "MoneyInput"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }

export { Input, MoneyInput }
