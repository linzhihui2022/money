import { typedBoolean } from "@/lib/utils"
import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { locales } from "../i18n/locales"

export async function updateSession(
    request: NextRequest,
    supabaseResponse = NextResponse.next({
        request,
    })
) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (user) return supabaseResponse
    const pathname = request.nextUrl.pathname.split("/").filter(typedBoolean)
    if (locales.includes(pathname.at(0) as (typeof locales)[number])) {
        pathname.shift()
    }
    if (pathname.at(0) !== "admin") {
        return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = "/auth/sign-in"
    return NextResponse.redirect(url)
}
