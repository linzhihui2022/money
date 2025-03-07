"use client"

import { useMedia } from "react-use"

export function useIsMobile() {
    const isDesktop = useMedia("(min-width: 768px)", true)

    return !isDesktop
}
