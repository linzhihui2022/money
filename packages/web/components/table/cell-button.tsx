import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { forwardRef } from "react";

const CellButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        variant="link"
        size="cell"
        className={cn("group", className)}
        ref={ref}
        {...props}
      >
        <span className="inline-flex items-center">{children}</span>
        <Edit className="group-hover:opacity-100 opacity-0" />
      </Button>
    );
  },
);

CellButton.displayName = "CellButton";
export default CellButton;
