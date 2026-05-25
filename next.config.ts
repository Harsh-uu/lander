import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve = config.resolve || {}
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            framer: path.resolve(__dirname, "lib/framer-shim.ts"),
        }
        return config
    },
    turbopack: {
        resolveAlias: {
            framer: "./lib/framer-shim.ts",
        },
    },
}

export default nextConfig
