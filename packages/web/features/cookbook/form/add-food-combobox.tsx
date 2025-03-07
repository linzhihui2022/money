import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FoodTypeCircle } from "@/components/ui/food-type"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Food } from "@prisma-client"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

export function FoodCombobox({
    foods,
    value,
    setValue,
}: {
    foods: Food[]
    value: number
    setValue: (v: number) => void
}) {
    const [open, setOpen] = useState(false)
    const current = useMemo(() => foods.find((food) => food.id === value), [foods, value])
    const t = useTranslations("cookbook")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    size="lg"
                    aria-expanded={open}
                    className={cn("w-full justify-between px-4", !current ? "text-primary/50" : "")}>
                    {current ? (
                        <span className="inline-flex space-x-1">
                            <FoodTypeCircle type={current.type} label={false} />
                            <span>{`${current.name}`}</span>
                            <span className="italic text-primary/50">{`${current.stock}(${current.unit})`}</span>
                        </span>
                    ) : (
                        t("Select food")
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={t("Search food")} />
                    <CommandList>
                        <CommandEmpty>{t("Not found")}</CommandEmpty>
                        <CommandGroup>
                            {foods.map((food) => (
                                <CommandItem
                                    key={food.id}
                                    value={food.name}
                                    onSelect={() => {
                                        setValue(+food.id)
                                        setOpen(false)
                                    }}>
                                    <Check
                                        className={cn("mr-2 h-4 w-4", value === food.id ? "opacity-100" : "opacity-0")}
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
    )
}
