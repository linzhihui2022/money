import * as React from "react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { Money } from "@/components/ui/format";
import { Label } from "@/components/ui/label";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const MoneyInput = React.forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <Input className={cn("pr-20", className)} ref={ref} {...props}></Input>
    {!!props.value && (
      <Label
        htmlFor={props.id}
        className="absolute right-0 top-0 bottom-0 h-10 px-3 py-2 flex items-center justify-end text-sm bg-input rounded-r-md"
      >
        <Money value={+props.value} />
      </Label>
    )}
  </div>
));
MoneyInput.displayName = "MoneyInput";
export { Input, MoneyInput };
