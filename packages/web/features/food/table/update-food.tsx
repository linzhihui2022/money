"use client"

import CellButton from "@/components/table/cell-button"
import DrawerDialog from "@/components/ui/drawer-dialog"
import { Form, FormField, InlineFormItem, SubmitButton } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FoodTypeSelect } from "@food/form/food-type-select"
import { useFoodRow } from "@food/ui/row"
import { zodResolver } from "@hookform/resolvers/zod"
import { Food, FoodType } from "@prisma-client"
import { updateFood } from "actions/food"
import { useTranslations } from "next-intl"
import { ComponentProps, PropsWithChildren, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

function UpdateFoodForm({ setOpen }: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
    const { row, updateRow } = useFoodRow()
    const form = useForm({
        resolver: zodResolver(
            z.object({
                name: z.string().min(1),
                unit: z.string().min(1),
                stock: z.coerce.number().min(0),
                type: z.enum([FoodType.OTHER, FoodType.FRUIT, FoodType.MEET, FoodType.SEAFOOD, FoodType.VEGETABLE]),
            })
        ),
        defaultValues: { ...row },
    })
    const [pending, startTransition] = useTransition()

    async function onSubmit(data: Pick<Food, "name" | "type" | "unit" | "stock">) {
        setOpen(false)
        form.reset()
        startTransition(async () => {
            updateRow((v) => ({ ...v, ...data }))
            await updateFood(row.id, data).catch(() => updateRow(row))
        })
    }
    const t = useTranslations("food")

    return (
        <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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

export default function UpdateFood({ children }: PropsWithChildren) {
    const { row } = useFoodRow()
    const t = useTranslations("food")

    return (
        <DrawerDialog
            title={t("Edit <Food>")}
            trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
            Body={UpdateFoodForm}
        />
    )
}
