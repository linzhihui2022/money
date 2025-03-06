"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import Image from "next/image";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { CircleIcon } from "lucide-react";
import { Button } from "./button";

export default function ImagePreview({
  images,
  onClose,
  index,
}: {
  images: string[];
  onClose: () => void;
  index: number;
}) {
  const [ref, api] = useEmblaCarousel({
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }
    if (index !== -1) {
      api.scrollTo(index, true);
    }
  }, [api, index]);
  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api, setSelectedIndex]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect).on("reInit", onSelect);
  }, [api, onSelect]);

  return (
    <DialogPrimitive.Root
      open={index !== -1}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
        }
      }}
    >
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
            "fixed left-1/2 lg:w-4/5 w-full bg-background top-1/2 lg:top-[40%] -translate-y-1/2 -translate-x-1/2 z-50 duration-200 rounded-lg overflow-hidden border sm:rounded-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          )}
        >
          <div className="lg:p-12 p-4">
            <div className="w-full grid gap-y-8">
              {images.length === 1 ? (
                <div className="w-full lg:aspect-w-16 lg:aspect-h-9 aspect-w-9 aspect-h-9 relative">
                  <Image
                    src={images[0]}
                    alt={`${images[0]}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <>
                  <div className="overflow-hidden" ref={ref}>
                    <div className="flex touch-pan-y -ml-4">
                      {images.map((image, index) => (
                        <div
                          className="transform-3d basis-3/5 lg:basis-4/5 min-w-0 pl-4 shrink-0 grow-0"
                          key={index}
                        >
                          <div className="w-full lg:aspect-w-16 lg:aspect-h-9 aspect-w-9 aspect-h-9 relative">
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
                        key={index}
                      >
                        <CircleIcon
                          className={cn(
                            "fill-current text-muted-foreground",
                            selectedIndex === index && "text-primary",
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
  );
}
