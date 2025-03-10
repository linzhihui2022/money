import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

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

    const user = await supabase.auth.getUser()
    if (user.error) {
        const pathname = request.nextUrl.pathname
        const paths = pathname.split("/").filter(Boolean)
        if (paths[0] === "admin" && !["/admin/sign-in", "/admin/auth/callback"].includes(pathname)) {
            return NextResponse.redirect(new URL("/admin/sign-in?next=" + encodeURIComponent(pathname), request.url))
        }
    }
    return supabaseResponse
}
