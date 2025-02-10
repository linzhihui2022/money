import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

let client: ReturnType<typeof createClient>;
export const supabase = () => {
  if (client) return client;
  client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    auth: {
      storage: {
        async getItem(key: string) {
          const cookieStore = await cookies();
          return cookieStore.get(`sb_${key}`)?.value || "";
        },
        async setItem(key, value) {
          const cookieStore = await cookies();
          cookieStore.set(`sb_${key}`, value);
        },
        async removeItem(key) {
          const cookieStore = await cookies();
          cookieStore.delete(`sb_${key}`);
        },
        isServer: true,
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return client;
};
