import Flicker from "@/app/component/Flicker"
import ImageGallery from "@/app/component/ImageGallery"
import ScrambleText from "@/app/component/ScrambleText"
import SVGParticles from "@/app/component/SVGParticles"

export const componentRegistry = {
    flicker: {
        name: "Flicker",
        Component: Flicker,
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
        defaultProps: {},
    },
    "scramble-text": {
        name: "Scramble Text",
        Component: ScrambleText,
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
        defaultProps: {},
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
