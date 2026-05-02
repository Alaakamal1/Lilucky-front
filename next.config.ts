
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
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = withNextIntl(nextConfig);