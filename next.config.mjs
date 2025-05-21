/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Add experimental features for better database support
  experimental: {
    serverComponentsExternalPackages: ["pg", "knex"],
  },
};

export default nextConfig;
