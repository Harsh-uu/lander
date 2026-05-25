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
    },
    "image-gallery": {
        name: "Image Gallery",
        Component: ImageGallery,
        framerUrl: `${BASE_URL}/framer-modules/ImageGallery.js`,
    },
    "scramble-text": {
        name: "Scramble Text",
        Component: ScrambleText,
        framerUrl: `${BASE_URL}/framer-modules/ScrambleText.js`,
    },
    "svg-particles": {
        name: "SVG Particles",
        Component: SVGParticles,
        framerUrl: `${BASE_URL}/framer-modules/SVGParticles.js`,
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
