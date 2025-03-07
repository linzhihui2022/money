"use server"

import { createClient } from "@/lib/supabase.server"
import { cache } from "react"

export const getUser = cache(async () => {
    const supabase = await createClient()
    return supabase.auth.getUser()
})
