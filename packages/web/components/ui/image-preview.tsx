"use client"

import { DialogOverlay } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DialogPortal } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import useEmblaCarousel from "embla-carousel-react"
import { CircleIcon } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import { Button } from "./button"

export default function ImagePreview({
    images,
    onClose,
    index,
}: {
    images: string[]
    onClose: () => void
    index: number
}) {
    const [ref, api] = useEmblaCarousel({
        loop: true,
    })
    const [selectedIndex, setSelectedIndex] = useState(0)
    useEffect(() => {
        if (!api) {
            return
        }
        if (index !== -1) {
            api.scrollTo(index, true)
        }
    }, [api, index])
    const onSelect = useCallback(() => {
        if (!api) return
        setSelectedIndex(api.selectedScrollSnap())
    }, [api, setSelectedIndex])

    useEffect(() => {
        if (!api) return
        onSelect()
        api.on("select", onSelect).on("reInit", onSelect)
    }, [api, onSelect])

    return (
        <DialogPrimitive.Root
            open={index !== -1}
            onOpenChange={(v) => {
                if (!v) onClose()
            }}>
            <VisuallyHidden asChild>
                <DialogPrimitive.Trigger />
            </VisuallyHidden>
            <DialogPortal>
                <DialogOverlay />
                <VisuallyHidden>
                    <DialogPrimitive.Title />
                </VisuallyHidden>
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border bg-background duration-200 sm:rounded-lg lg:top-[40%] lg:w-4/5",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
                    )}>
                    <div className="p-4 lg:p-12">
                        <div className="grid w-full gap-y-8">
                            {images.length === 1 ? (
                                <div className="aspect-h-9 aspect-w-9 relative w-full lg:aspect-h-9 lg:aspect-w-16">
                                    <Image src={images[0]} alt={`${images[0]}`} fill className="object-cover" />
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-hidden" ref={ref}>
                                        <div className="-ml-4 flex touch-pan-y">
                                            {images.map((image, index) => (
                                                <div
                                                    className="transform-3d min-w-0 shrink-0 grow-0 basis-3/5 pl-4 lg:basis-4/5"
                                                    key={index}>
                                                    <div className="aspect-h-9 aspect-w-9 relative w-full lg:aspect-h-9 lg:aspect-w-16">
                                                        <Image
                                                            src={image}
                                                            alt={`${index}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        {images.map((_, index) => (
                                            <Button
                                                variant="link"
                                                size="icon"
                                                onClick={() => api?.scrollTo(index)}
                                                key={index}>
                                                <CircleIcon
                                                    className={cn(
                                                        "fill-current text-muted-foreground",
                                                        selectedIndex === index && "text-primary"
                                                    )}
                                                />
                                            </Button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </DialogPrimitive.Root>
    )
}
