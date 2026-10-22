import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  ...(isExport ? {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    basePath: basePath,
  } : {
    cacheComponents: true,
    partialPrefetching: true,
  }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
