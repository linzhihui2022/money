"use client"

import { Button } from "@/components/ui/button"
import DrawerDialog from "@/components/ui/drawer-dialog"
import { Form, FormField, InlineFormItem, SubmitButton } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FoodTypeSelect } from "@food/form/food-type-select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Food, FoodType } from "@prisma-client"
import { createFood } from "actions/food"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { ComponentProps, useOptimistic, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type FoodFormFields = Pick<Food, "name" | "type" | "unit" | "stock">
function AddFoodForm({ setOpen }: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
    const form = useForm<FoodFormFields>({
        resolver: zodResolver(
            z.object({
                name: z.string().min(1),
                type: z.enum([FoodType.FRUIT, FoodType.VEGETABLE, FoodType.MEET, FoodType.SEAFOOD, FoodType.OTHER]),
                unit: z.string().min(1),
                stock: z.coerce.number().min(0),
            })
        ),
        defaultValues: { name: "", type: FoodType.MEET, unit: "g", stock: 0 },
    })
    const [, setState] = useOptimistic<FoodFormFields | null>(null)
    const [pending, startTransition] = useTransition()
    async function onSubmit(data: FoodFormFields) {
        setOpen(false)
        form.reset()
        startTransition(async () => {
            setState(data)
            await createFood(data).finally(() => setState(null))
        })
    }
    const t = useTranslations("food")

    return (
        <Form {...form}>
            <form className="w-full space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <InlineFormItem label={t("Name")}>
                            <Input {...field} />
                        </InlineFormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <InlineFormItem label={t("Stock")}>
                            <Input {...field} type="number" />
                        </InlineFormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <InlineFormItem label={t("Unit")}>
                            <Input {...field} />
                        </InlineFormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <InlineFormItem label={t("Type")}>
                            <FoodTypeSelect onValueChange={field.onChange} defaultValue={field.value} />
                        </InlineFormItem>
                    )}
                />
                <SubmitButton pending={pending} />
            </form>
        </Form>
    )
}

export function AddFoodDialog() {
    const t = useTranslations("food")
    return (
        <DrawerDialog
            title={t("Add new food")}
            trigger={
                <Button size="icon" variant="ghost">
                    <Plus />
                    <span className="sr-only">{t("Add new food")}</span>
                </Button>
            }
            Body={AddFoodForm}
        />
    )
}
