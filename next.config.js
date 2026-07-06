const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output:'standalone',
  outputFileTracingRoot: path.join(process.cwd()),

  allowedDevOrigins: ["192.168.29.30"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aimitr.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aimitr.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
