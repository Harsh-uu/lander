import Flicker from "@/app/component/Flicker"
import ImageGallery from "@/app/component/ImageGallery"
import ScrambleText from "@/app/component/ScrambleText"
import SVGParticles from "@/app/component/SVGParticles"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ""

export const componentRegistry = {
    flicker: {
        name: "Flicker",
        Component: Flicker,
        framerUrl: `${BASE_URL}/framer-modules/Flicker.js`,
        defaultProps: {
            contentType: "text",
            text: "Flicker",
            tag: "h1",
            colorMode: "solid",
            fontColor: "#111111",
            font: { fontSize: 64, fontWeight: 700 },
        },
    },
    "image-gallery": {
        name: "Image Gallery",
        Component: ImageGallery,
        framerUrl: `${BASE_URL}/framer-modules/ImageGallery.js`,
        defaultProps: {},
    },
    "scramble-text": {
        name: "Scramble Text",
        Component: ScrambleText,
        framerUrl: `${BASE_URL}/framer-modules/ScrambleText.js`,
        defaultProps: {
            words: "Scramble\nText",
            tag: "h1",
            color: "#111111",
            font: { fontSize: 64, fontWeight: 700 },
        },
    },
    "svg-particles": {
        name: "SVG Particles",
        Component: SVGParticles,
        framerUrl: `${BASE_URL}/framer-modules/SVGParticles.js`,
        defaultProps: {},
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
