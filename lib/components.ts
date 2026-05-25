import Flicker from "@/app/component/Flicker"
import ImageGallery from "@/app/component/ImageGallery"
import ScrambleText from "@/app/component/ScrambleText"
import SVGParticles from "@/app/component/SVGParticles"

export const componentRegistry = {
    flicker: {
        name: "Flicker",
        Component: Flicker,
        framerUrl:
            "https://framer.com/m/FlickerText-wBddWw.js@pdE50YWeVzotCoNXb5o9",
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
            "https://framer.com/m/GlitchReveal-yJrAov.js@J83TSYyiotyY6e0Iuy71",
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
            "https://framer.com/m/SvgMapper-Xp5dP5.js@mki6qSA9WljVV8SZT3qs",
        defaultProps: {},
    },
} as const

export type ComponentSlug = keyof typeof componentRegistry
export type ComponentEntry = (typeof componentRegistry)[ComponentSlug]
