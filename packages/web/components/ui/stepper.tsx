import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { CheckCircle } from "lucide-react";

interface StepperState {
  current: number;
  setStep: Dispatch<SetStateAction<StepperState["current"]>>;
  onNext: () => void;
  onPrev: () => void;
}
const StepperContext = createContext<StepperState>({} as StepperState);

const StepperRoot = ({
  children,
  defaultValue,
}: PropsWithChildren<{ defaultValue: number }>) => {
  const [step, setStep] = useState(defaultValue);
  const onNext = useCallback(() => setStep((v) => v + 1), []);
  const onPrev = useCallback(() => setStep((v) => v - 1), []);
  const value = useMemo(
    () => ({ current: step, setStep, onNext, onPrev }),
    [step, onNext, onPrev],
  );
  return (
    <StepperContext.Provider value={value}>
      <TabsPrimitive.Root value={`${step}`} onValueChange={(v) => setStep(+v)}>
        {children}
      </TabsPrimitive.Root>
    </StepperContext.Provider>
  );
};

export const useStepper = () => useContext(StepperContext);

const StepperList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex group-list justify-between items-center pb-6 group",
      className,
    )}
    {...props}
  />
));

StepperList.displayName = "StepperList";

const StepperTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  { value: number } & Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    "value"
  >
>(({ className, value, children, ...props }, ref) => {
  const { current } = useStepper();
  return (
    <>
      <span
        className="w-full h-0.5 first:hidden data-[step-status=done]:bg-primary data-[step-status=undone]:bg-primary/30"
        data-step-status={value <= current ? "done" : "undone"}
      />
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "relative text-sm h-5 w-20 flex flex-shrink-0 flex-col items-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-30 group/trigger",
          className,
        )}
        value={`${value}`}
        disabled={value > current}
        data-step-status={
          value === current ? "active" : value < current ? "done" : "undone"
        }
        {...props}
      >
        <span className="size-5 absolute hidden group-data-[step-status=done]/trigger:flex group-data-[step-status=done]:hover/trigger:hidden">
          <CheckCircle />
        </span>
        <span
          className={cn(
            "absolute rounded-full z-10 size-5 group-data-[step-status=active]/trigger:ring-2 ring-offset-2 ring-ring text-xs items-center justify-center bg-primary text-white",
            "hidden group-data-[step-status=active]/trigger:flex group-data-[step-status=undone]/trigger:flex",
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "absolute top-full mt-2 hidden group-hover:flex group-hover/trigger:underline group-data-[step-status=active]:font-bold",
          )}
        >
          {children}
        </span>
      </TabsPrimitive.Trigger>
    </>
  );
});
StepperTrigger.displayName = "StepperTrigger";

const StepperContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    "value"
  > & { value: number }
>(({ className, value, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    value={`${value}`}
    {...props}
  />
));
StepperContent.displayName = "StepperContent";

export { StepperList, StepperRoot, StepperTrigger, StepperContent };
