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
            "https://framer.com/m/ImageGallery-3YC6Rw.js@FYfO00JRiqAinPcYUgHE",
        defaultProps: {},
    },
    
    "scramble-text": {
        name: "Scramble Text",
        Component: ScrambleText,
        framerUrl:
            "https://framer.com/m/GlitchReveal-yJrAov.js@CkEMHytnATaA1moXFnZf",
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
        framerUrl:
            "https://framer.com/m/SvgMapper-Xp5dP5.js@HrY2NkfEbXlV1CFS0FeH",
        defaultProps: {},
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
