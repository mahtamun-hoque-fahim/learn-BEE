import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only the kysely adapter + kysely need externalizing for Turbopack tracing;
  // better-auth itself must stay bundled so better-auth/react resolves the app's
  // React during SSR (externalizing it breaks useSession prerendering).
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
};

export default nextConfig;
