"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react"

import { useIsMobile } from "../hooks/use-mobile"

export default function DrawerDialog({
    trigger,
    Body,
    title,
    description,
    open: _open,
}: {
    trigger: ReactNode
    title: ReactNode
    description?: ReactNode
    Body: FC<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }>
    open?: boolean
}) {
    const [open, setOpen] = useState<boolean>(_open || false)
    const isMobile = useIsMobile()
    useEffect(() => {
        setOpen(_open || false)
    }, [_open])

    if (!isMobile) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description ? (
                            <DialogDescription>{description}</DialogDescription>
                        ) : (
                            <VisuallyHidden asChild>
                                <DialogDescription />
                            </VisuallyHidden>
                        )}
                    </DialogHeader>
                    <Body open={open} setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <Body open={open} setOpen={setOpen} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
