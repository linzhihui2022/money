"use client"

import { Loader2Icon } from "lucide-react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import {
    ComponentPropsWithoutRef,
    PropsWithChildren,
    Suspense as ReactSuspense,
    TransitionStartFunction,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useTransition,
} from "react"

interface PendingContextValue {
    isPending: boolean
    startTransition: TransitionStartFunction
}
const PendingContext = createContext<PendingContextValue>({} as PendingContextValue)

const PendingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPending, startTransition] = useTransition()
    return (
        <PendingContext.Provider value={{ isPending, startTransition }}>
            {children}
            {isPending && (
                <div className="fixed bottom-5 right-5 rounded-full border p-2 shadow">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                </div>
            )}
        </PendingContext.Provider>
    )
}

const Suspense = ({ children, fallback }: PropsWithChildren<{ fallback: React.ReactNode }>) => {
    const { isPending } = useContext(PendingContext)
    return <ReactSuspense fallback={fallback}>{isPending ? fallback : children}</ReactSuspense>
}

const useNav = () => {
    const router = useRouter()
    const { startTransition, isPending } = useContext(PendingContext)
    const navigate = useCallback(
        (path: ComponentPropsWithoutRef<typeof NextLink>["href"]) => {
            if (path) {
                startTransition(async () => {
                    router.push(path.toString())
                })
            }
        },
        [router, startTransition]
    )
    return { navigate, isPending }
}

const Link = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<typeof NextLink>>(({ onClick, ...props }, ref) => {
    const { navigate } = useNav()
    return (
        <NextLink
            ref={ref}
            onClick={(e) => {
                e.preventDefault()
                navigate(props.href)
                onClick?.(e)
            }}
            {...props}
        />
    )
})

Link.displayName = NextLink.displayName

export { Link, PendingProvider, useNav, Suspense }
