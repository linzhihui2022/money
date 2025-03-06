import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}
const imagePath = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: imagePath.protocol.replace(":", "") as "http" | "https",
        hostname: imagePath.hostname,
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
