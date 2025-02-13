import { Food } from "prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { FoodTypeCircle } from "@/components/ui/food-type";
import { useMemo, useState } from "react";

export function FoodCombobox({
  foods,
  value,
  setValue,
}: {
  foods: Food[];
  value: number;
  setValue: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = useMemo(
    () => foods.find((food) => food.id === value),
    [foods, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="w-full justify-between px-4"
        >
          {current ? `${current.name}(${current.unit})` : "Select food"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search food" />
          <CommandList>
            <CommandEmpty>No food found.</CommandEmpty>
            <CommandGroup>
              {foods.map((food) => (
                <CommandItem
                  key={food.id}
                  value={food.name}
                  onSelect={() => {
                    setValue(+food.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === food.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="inline-flex items-center space-x-1">
                    <FoodTypeCircle type={food.type} label={false} />
                    <span>{`${food.name}(${food.unit})`}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
