import { defineConfig } from "tsup"

export default defineConfig({
    entry: {
        Flicker: "app/component/Flicker.tsx",
        ImageGallery: "app/component/ImageGallery.tsx",
        ScrambleText: "app/component/ScrambleText.tsx",
        SVGParticles: "app/component/SVGParticles.tsx",
    },
    format: ["esm"],
    outDir: "public/framer-modules",
    external: ["react", "react-dom", "framer-motion", "framer"],
    dts: false,
    outExtension: () => ({ js: ".js" }),
    clean: true,
})
