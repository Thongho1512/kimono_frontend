import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Re-enable Next.js image optimisation (serves WebP, auto-resizes, lazy-loads)
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Cloudinary (from existing uploads)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Your VPS backend
      { protocol: "https", hostname: "kyokimonorental.com" },
      // Allow localhost during development
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@radix-ui/react-icons",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Preconnect to external APIs for faster DNS resolution
          {
            key: "Link",
            value:
              "<https://res.cloudinary.com>; rel=preconnect, <https://kyokimonorental.com>; rel=preconnect",
          },
        ],
      },
      {
        // Long cache for static assets
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
