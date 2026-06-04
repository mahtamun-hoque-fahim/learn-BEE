import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Better Auth (and its bundled kysely adapter) are server-only; let Node
  // resolve them at runtime instead of having Turbopack bundle/tree-shake them.
  serverExternalPackages: ["better-auth", "@better-auth/kysely-adapter", "kysely"],
};

export default nextConfig;
