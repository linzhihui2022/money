import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { ComponentProps, ReactNode } from "react"
import { useMedia } from "react-use"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./drawer"

export function ResponsiveDialog({
    title,
    headerAlignment = "left",
    description,
    children,
    trigger,
    footer,
    open,
    onOpenChange,
    drawerClassName,
    dialogClassName,
    dialogProps,
    drawerProps,
    disableClickOutside,
}: {
    title?: ReactNode
    headerAlignment?: "center" | "left" | "right"
    description?: ReactNode
    children?: ReactNode
    trigger?: ReactNode
    footer?: ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    drawerClassName?: string
    dialogClassName?: string
    dialogProps?: ComponentProps<typeof Dialog>
    drawerProps?: ComponentProps<typeof Drawer>
    disableClickOutside?: boolean
}) {
    const isDesktop = useMedia("(min-width: 768px)")
    const headerAlignClass = {
        center: "text-center",
        left: "text-left",
        right: "text-right",
    }

    const interactionOutside = disableClickOutside
        ? (e: Event) => {
              e.preventDefault()
          }
        : undefined

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
                {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
                <DialogContent
                    className={cn("p-8 sm:max-w-[625px]", dialogClassName)}
                    onPointerDownOutside={interactionOutside}
                    onInteractOutside={interactionOutside}>
                    {title || description ? (
                        <DialogHeader>
                            {title ? (
                                <DialogTitle className={headerAlignClass[headerAlignment]}>{title}</DialogTitle>
                            ) : (
                                <VisuallyHidden asChild>
                                    <DialogTitle />
                                </VisuallyHidden>
                            )}
                            {description ? (
                                <DialogDescription>{description}</DialogDescription>
                            ) : (
                                <VisuallyHidden asChild>
                                    <DialogDescription />
                                </VisuallyHidden>
                            )}
                        </DialogHeader>
                    ) : null}

                    {children}
                    {footer ? <DialogFooter className="pt-2">{footer}</DialogFooter> : null}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps} dismissible={!disableClickOutside}>
            {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
            <DrawerContent
                className={cn("p-4", drawerClassName)}
                onPointerDownOutside={interactionOutside}
                onInteractOutside={interactionOutside}>
                {title || description ? (
                    <DrawerHeader className={headerAlignClass[headerAlignment]}>
                        {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                        {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                    </DrawerHeader>
                ) : null}

                {children}
                {footer ? <DrawerFooter className="pt-2">{footer}</DrawerFooter> : null}
            </DrawerContent>
        </Drawer>
    )
}
