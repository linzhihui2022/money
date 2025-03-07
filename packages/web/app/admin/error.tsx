"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <main className="p-4 md:p-6">
            <div className="mb-8 space-y-4">
                <h1 className="text-lg font-semibold md:text-2xl">{error.message}</h1>
                <Button onClick={() => reset()}>Reset</Button>
            </div>
        </main>
    )
}
