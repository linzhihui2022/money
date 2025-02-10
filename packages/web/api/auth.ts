"use server";

import { supabase } from "@/lib/supabase";
import { cache } from "react";

export const getUser = cache(async () => supabase().auth.getUser());
