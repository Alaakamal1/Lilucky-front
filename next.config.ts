
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: false,
//   },
//   typescript: {
//     ignoreBuildErrors: false,
//   },
// };

// module.exports = nextConfig;


// import createNextIntlPlugin from "next-intl/plugin";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: false,
//   },
//   typescript: {
//     ignoreBuildErrors: false,
//   },
// };

// module.exports = createNextIntlPlugin()(nextConfig);

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "lilucky-backend.vercel.app",
      },
      {
        protocol: "http" as const,
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
} as const satisfies import('next').NextConfig;

export default withNextIntl(nextConfig);