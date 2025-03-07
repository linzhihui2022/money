"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useState } from "react"

export default function DeleteDialog({
    onDeleteAction,
    name,
    deleted,
}: {
    onDeleteAction: (setOpen: Dispatch<SetStateAction<boolean>>) => void
    name: string
    deleted?: boolean
}) {
    const [open, setOpen] = useState(false)
    const t = useTranslations("form")
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    data-deleted={deleted ? "yes" : ""}
                    variant="link"
                    size="icon"
                    className="hover:text-destructive">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Are you absolutely sure to remove {name}?", { name })}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("This action cannot be undone<Dot> This will permanently delete and remove your data<Dot>")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="destructive" onClick={() => onDeleteAction(setOpen)}>
                        {t("Delete")}
                    </Button>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
