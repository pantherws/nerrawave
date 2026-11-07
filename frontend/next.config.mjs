/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/Favicon%20Dark.png",
        permanent: false,
      },
      {
        source: "/journal",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/journal/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/billing",
        destination: "/buy-credits",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
