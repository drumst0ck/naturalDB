/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["typeorm"],
  },
  images: {
    domains: ["supabase.drumstock.dev"],
  },
};

export default nextConfig;
