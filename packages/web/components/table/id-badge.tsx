"use client"

import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

export default function IdBadge({ id }: { id: string }) {
    const query = useSearchParams()
    if (query.get("new") === id) {
        return (
            <Badge variant="default" className="ml-2 uppercase">
                new
            </Badge>
        )
    }
    if (query.get("edited") === id) {
        return (
            <Badge variant="default" className="ml-2 uppercase">
                edited
            </Badge>
        )
    }
    return <></>
}
