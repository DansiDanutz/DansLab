import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the file-tracing root to this directory so Next.js does not infer
  // it from the parent monorepo's pnpm-lock.yaml. Without this, dev/build
  // emit a workspace-root warning on every run.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
