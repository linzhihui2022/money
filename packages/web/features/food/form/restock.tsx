"use client"

import { Form, FormField, InlineFormItem, SubmitButton } from "@/components/ui/form"
import { AddFoods, FoodsDescription } from "@/features/cookbook/form/add-foods"
import { useTaskPanel } from "@/lib/use-task-panel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    foods: z.array(z.object({ quantity: z.coerce.number().min(1), food: z.number() })).min(1),
})

type FormFields = z.infer<typeof formSchema>
export const RestockForm = () => {
    const { onRestock, foods } = useTaskPanel()
    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: { foods: [] },
    })
    async function onSubmit(data: FormFields) {
        onRestock(data.foods)
        form.reset()
    }
    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="foods"
                    render={({ field }) => (
                        <InlineFormItem
                            description={
                                <FoodsDescription value={field.value} foods={foods} setValueAction={field.onChange} />
                            }>
                            <AddFoods value={field.value} foods={foods} setValueAction={field.onChange} />
                        </InlineFormItem>
                    )}
                />
                <SubmitButton position="full" />
            </form>
        </Form>
    )
}
