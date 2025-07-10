/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      os: false,
      oracledb: false,
      'pg-query-stream': false,
      fs: false,
      tls: false,
      dns: false,
      child_process: false,
    };

    config.module = config.module || {};
    config.module.exprContextCritical = false;

    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cmsm.s3.us-east-005.backblazeb2.com" },
      { protocol: "https", hostname: "sso.staging.acesso.gov.br" },
      { protocol: "https", hostname: "sso.acesso.gov.br" },
    ],
  },
};

export default nextConfig;
