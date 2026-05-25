import Flicker from "@/app/component/Flicker"
import ImageGallery from "@/app/component/ImageGallery"
import ScrambleText from "@/app/component/ScrambleText"
import SVGParticles from "@/app/component/SVGParticles"

export const componentRegistry = {
    flicker: {
        name: "Flicker",
        Component: Flicker,
        framerUrl:
            "https://framer.com/m/FlickerText-wBddWw.js@iaSl8kOGBQNJiSHAKwwf",
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
        framerUrl:
            "https://framer.com/m/ImageGallery-3YC6Rw.js@joD3UXGM4SwfM05uPlEd",
        defaultProps: {},
    },
    
    "scramble-text": {
        name: "Scramble Text",
        Component: ScrambleText,
        framerUrl:
            "https://framer.com/m/ScrambleText-v9xmyx.js@VufUjyCldxjC78r5wQq2",
        defaultProps: {
            words: "Scramble\nText",
            tag: "h1",
            color: "#111111",
            font: { fontSize: 64, fontWeight: 700 },
        },
    },
    "svg-particles": {
        name: "Image Particles",
        Component: SVGParticles,
        framerUrl:
            "https://framer.com/m/ImageParticles-VqA663.js@3lmd95whAQOnZlL0ASSG",
        defaultProps: {},
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
