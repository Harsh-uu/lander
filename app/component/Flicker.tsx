"use client"

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx
    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by
    const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
    const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
    const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
    return (x: number) => {
        let t = x
        for (let i = 0; i < 8; i++) {
            const dx = sampleX(t) - x
            const d = sampleDX(t)
            if (Math.abs(dx) < 1e-6) break
            if (d === 0) break
            t -= dx / d
        }
        return sampleY(Math.max(0, Math.min(1, t)))
    }
}

function makeEaseFn(ease: any): (t: number) => number {
    if (Array.isArray(ease) && ease.length === 4)
        return cubicBezier(ease[0], ease[1], ease[2], ease[3])
    switch (ease) {
        case "linear":
            return (t) => t
        case "easeIn":
            return (t) => t * t
        case "easeOut":
            return (t) => 1 - (1 - t) * (1 - t)
        case "easeInOut":
            return (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t))
        case "circIn":
            return (t) => 1 - Math.sqrt(1 - t * t)
        case "circOut":
            return (t) => Math.sqrt(1 - (t - 1) * (t - 1))
        case "circInOut":
            return (t) =>
                t < 0.5
                    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
                    : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2
        case "backIn":
            return (t) => 2.70158 * t * t * t - 1.70158 * t * t
        case "backOut":
            return (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2
        default:
            return (t) => t
    }
}

type TagType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
type ReplayMode = "yes" | "no"
type AmountMode = "above" | "middle" | "below"
type RestState = "filled" | "outline" | "invisible"
type LetterFlickerMode = "stroke" | "opacity"
type StrokePosition = "start" | "middle" | "end"

interface FlickerCfg {
    duration: number
    easeCurve: any
    flickerCount: number
    showStroke: boolean
    strokePosition: StrokePosition
    strokeCount: number
    strokeColor: string
    strokeWidth: number
    restState: RestState
    delay: number
    shakeEnabled: boolean
    shakeWidth: number
    shakeSpeed: number
    wordFlickerEnabled: boolean
    letterFlickerEnabled: boolean
    letterFlickerMode: LetterFlickerMode
    letterFlickerIntensity: number
    letterFlickerOpacity: number
}

function buildTextCfg(m: any): FlickerCfg {
    return {
        duration: m?.ease?.duration ?? 5,
        easeCurve: m?.ease?.ease ?? "linear",
        flickerCount: m?.flickerCount ?? 4,
        showStroke: m?.showStroke ?? true,
        strokePosition: m?.strokePosition ?? "start",
        strokeCount: m?.strokeCount ?? 1,
        strokeColor: m?.strokeColor ?? "#ffffff",
        strokeWidth: m?.strokeWidth ?? 1.5,
        restState: m?.restState ?? "filled",
        delay: m?.delay ?? 0,
        shakeEnabled: m?.shakeEnabled ?? false,
        shakeWidth: m?.shakeWidth ?? 10,
        shakeSpeed: m?.shakeSpeed ?? 10,
        wordFlickerEnabled: m?.wordFlickerEnabled ?? true,
        letterFlickerEnabled: m?.letterFlickerEnabled ?? false,
        letterFlickerMode: m?.letterFlickerMode ?? "stroke",
        letterFlickerIntensity: m?.letterFlickerIntensity ?? 10,
        letterFlickerOpacity: m?.letterFlickerOpacity ?? 30,
    }
}
function buildImageCfg(m: any): FlickerCfg {
    return {
        duration: m?.ease?.duration ?? 5,
        easeCurve: m?.ease?.ease ?? "linear",
        flickerCount: m?.flickerCount ?? 4,
        showStroke: false,
        strokePosition: "start",
        strokeCount: 1,
        strokeColor: "#ffffff",
        strokeWidth: 1.5,
        restState: m?.restState ?? "filled",
        delay: m?.delay ?? 0,
        shakeEnabled: m?.shakeEnabled ?? false,
        shakeWidth: m?.shakeWidth ?? 10,
        shakeSpeed: m?.shakeSpeed ?? 10,
        wordFlickerEnabled: true,
        letterFlickerEnabled: false,
        letterFlickerMode: "stroke",
        letterFlickerIntensity: 10,
        letterFlickerOpacity: 30,
    }
}

const DEFAULT_TEXT_CFG = buildTextCfg(undefined)

export default function OutlineFillText(props: any) {
    const {
        contentType,
        text,
        image,
        font,
        colorMode,
        fontColor,
        gradientStart,
        gradientEnd,
        gradientAngle,
        tag,
        // Text
        textEnterFlickerEnabled,
        flicker,
        textHoverFlickerEnabled,
        flickerHover,
        // Image
        imageEnterFlickerEnabled,
        flickerImage,
        imageHoverFlickerEnabled,
        flickerImageHover,
    } = props
    const isImage: boolean = (contentType ?? "text") === "image"

    const enterCfg: FlickerCfg = isImage
        ? buildImageCfg(flickerImage)
        : buildTextCfg(flicker)
    const hoverCfg: FlickerCfg = isImage
        ? buildImageCfg(flickerImageHover)
        : buildTextCfg(flickerHover)

    const enterEnabled: boolean = isImage
        ? imageEnterFlickerEnabled ?? true
        : textEnterFlickerEnabled ?? true
    const hoverEnabled: boolean = isImage
        ? imageHoverFlickerEnabled ?? false
        : textHoverFlickerEnabled ?? false

    // Enter trigger meta (position + replay) lives inside the enter modal.
    const enterModal = isImage ? flickerImage : flicker
    const replay: ReplayMode = enterModal?.replay ?? "no"
    const amount: AmountMode = enterModal?.position ?? "above"

    // Initial config for render styling (before any trigger fires).
    const initialCfg = enterEnabled ? enterCfg : hoverEnabled ? hoverCfg : enterCfg
    const [activeCfg, setActiveCfg] = useState<FlickerCfg>(initialCfg)

    const [currentPhase, setCurrentPhase] = useState<string>(initialCfg.restState)
    const [moveX, setMoveX] = useState<number>(0)
    const [flickerLetters, setFlickerLetters] = useState<Set<number>>(new Set())
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
    const elementRef = useRef<HTMLElement | null>(null)
    const hasPlayedRef = useRef(false)
    const enterDoneRef = useRef<boolean>(!enterEnabled)

    const getThreshold = (): number => {
        switch (amount) {
            case "above":
                return 0
            case "middle":
                return 0.5
            case "below":
                return 1.0
            default:
                return 0
        }
    }

    function generateTimings(
        count: number,
        totalMs: number,
        easeCurve: any
    ): number[] {
        const slots = count
        const fn = makeEaseFn(easeCurve)
        const intervals: number[] = []
        let prev = 0
        for (let i = 1; i <= slots; i++) {
            const t = i / slots
            const cur = fn(t) * totalMs
            intervals.push(Math.max(0, cur - prev))
            prev = cur
        }
        return intervals
    }

    function buildVisibleItems(cfg: FlickerCfg): string[] {
        const sc = Math.min(cfg.strokeCount ?? 1, cfg.flickerCount)
        if (!cfg.showStroke) {
            return Array(cfg.flickerCount).fill("filled")
        }
        const fillCount = Math.max(1, cfg.flickerCount - sc)
        const strokes = Array(sc).fill("outline")
        const pos: StrokePosition = cfg.strokePosition ?? "start"
        if (pos === "start") {
            return [...strokes, ...Array(fillCount).fill("filled")]
        }
        if (pos === "end") {
            return [
                ...Array(fillCount - 1).fill("filled"),
                ...strokes,
                "filled",
            ]
        }
        const before = Math.floor(fillCount / 2)
        const after = fillCount - before
        return [
            ...Array(before).fill("filled"),
            ...strokes,
            ...Array(after).fill("filled"),
        ]
    }

    function runAnimation(cfg: FlickerCfg) {
        timersRef.current.forEach(clearTimeout)
        timersRef.current = []
        setFlickerLetters(new Set())
        setActiveCfg(cfg)
        if (!cfg.wordFlickerEnabled && !cfg.letterFlickerEnabled) return
        const totalMs = cfg.duration * 1000
        const chars = (text ?? "").split("") as string[]
        const nonSpaceIndices = chars.reduce<number[]>((acc, c, i) => {
            if (c.trim() !== "") acc.push(i)
            return acc
        }, [])
        const scheduleTicks = (windowStart: number, windowDuration: number) => {
            if (!cfg.letterFlickerEnabled || nonSpaceIndices.length === 0)
                return
            const cycleDuration = Math.round(
                1000 *
                    Math.pow(50 / 1000, (cfg.letterFlickerIntensity - 1) / 19)
            )
            const sub1 = Math.round(cycleDuration / 3)
            const sub2 = Math.round((2 * cycleDuration) / 3)
            const windowEnd = windowStart + windowDuration
            let tickCursor = windowStart
            while (tickCursor < windowEnd) {
                const tFlicker1 = tickCursor
                const tFill = tickCursor + sub1
                const tFlicker2 = tickCursor + sub2
                const slot = { sel: new Set<number>() }
                timersRef.current.push(
                    setTimeout(() => {
                        const count = Math.min(
                            nonSpaceIndices.length,
                            Math.floor(Math.random() * 2) + 1
                        )
                        const shuffled = [...nonSpaceIndices].sort(
                            () => Math.random() - 0.5
                        )
                        slot.sel = new Set(shuffled.slice(0, count))
                        setFlickerLetters(slot.sel)
                    }, tFlicker1)
                )
                if (tFill < windowEnd) {
                    timersRef.current.push(
                        setTimeout(() => setFlickerLetters(new Set()), tFill)
                    )
                }
                if (tFlicker2 < windowEnd) {
                    timersRef.current.push(
                        setTimeout(() => setFlickerLetters(slot.sel), tFlicker2)
                    )
                }
                tickCursor += cycleDuration
            }
            timersRef.current.push(
                setTimeout(() => setFlickerLetters(new Set()), windowEnd)
            )
        }
        if (cfg.wordFlickerEnabled) {
            setCurrentPhase(cfg.restState)
            setMoveX(0)
            const visibleItems = buildVisibleItems(cfg)
            const sequence: string[] = []
            visibleItems.forEach((item) => {
                sequence.push("invisible")
                sequence.push(item)
            })
            const intervals = generateTimings(
                sequence.length,
                totalMs,
                cfg.easeCurve
            )
            interface PhaseSlot {
                phase: string
                startMs: number
                durationMs: number
            }
            const phaseSlots: PhaseSlot[] = []
            let cursor = cfg.delay * 1000
            sequence.forEach((phase, i) => {
                const startMs = cursor
                const durationMs = intervals[i] ?? 0
                phaseSlots.push({ phase, startMs, durationMs })
                timersRef.current.push(
                    setTimeout(() => setCurrentPhase(phase), startMs)
                )
                cursor += durationMs
            })
            timersRef.current.push(
                setTimeout(() => {
                    setCurrentPhase(cfg.restState)
                    setMoveX(0)
                    setFlickerLetters(new Set())
                }, cursor)
            )
            if (cfg.shakeEnabled) {
                const flipMs = Math.round(
                    500 * Math.pow(30 / 500, (cfg.shakeSpeed - 1) / 19)
                )
                const animStart = cfg.delay * 1000
                const animEnd = cursor
                let flipCursor = animStart
                let dir = 1
                while (flipCursor < animEnd) {
                    const t = flipCursor
                    const d = dir
                    timersRef.current.push(
                        setTimeout(() => setMoveX(d * cfg.shakeWidth), t)
                    )
                    dir *= -1
                    flipCursor += flipMs
                }
            }
            phaseSlots.forEach(({ phase, startMs, durationMs }) => {
                if (phase !== "filled" && phase !== "outline") return
                scheduleTicks(startMs, durationMs)
            })
        } else {
            scheduleTicks(cfg.delay * 1000, totalMs)
        }
    }

    // Reset when controls change. Use a stable signature so we don't react
    // to identity-only changes on prop objects.
    const sig = JSON.stringify({
        contentType,
        enterEnabled,
        hoverEnabled,
        enterCfg,
        hoverCfg,
        replay,
        amount,
        colorMode,
        fontColor,
        gradientStart,
        gradientEnd,
        gradientAngle,
    })
    useEffect(() => {
        timersRef.current.forEach(clearTimeout)
        timersRef.current = []
        hasPlayedRef.current = false
        enterDoneRef.current = !enterEnabled
        setFlickerLetters(new Set())
        const baseCfg = enterEnabled
            ? enterCfg
            : hoverEnabled
              ? hoverCfg
              : enterCfg
        setActiveCfg(baseCfg)
        setCurrentPhase(baseCfg.restState)
        setMoveX(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sig])

    // IntersectionObserver — only when enter trigger is enabled.
    useEffect(() => {
        if (!enterEnabled) return
        if (!elementRef.current) return
        const threshold = getThreshold()
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!hasPlayedRef.current) {
                            hasPlayedRef.current = true
                            enterDoneRef.current = false
                            runAnimation(enterCfg)
                            const totalMs =
                                (enterCfg.delay + enterCfg.duration) * 1000
                            timersRef.current.push(
                                setTimeout(() => {
                                    enterDoneRef.current = true
                                }, totalMs)
                            )
                        }
                    } else {
                        if (replay === "yes") {
                            hasPlayedRef.current = false
                            enterDoneRef.current = false
                            timersRef.current.forEach(clearTimeout)
                            timersRef.current = []
                            setFlickerLetters(new Set())
                            setCurrentPhase(enterCfg.restState)
                            setMoveX(0)
                        }
                    }
                })
            },
            { threshold }
        )
        observer.observe(elementRef.current)
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sig])

    const handleMouseEnter = () => {
        if (!hoverEnabled) return
        if (enterEnabled && !enterDoneRef.current) return
        runAnimation(hoverCfg)
    }

    const getFilledStyle = () => {
        if (colorMode === "gradient") {
            return {
                background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                WebkitTextStroke: "0px transparent",
                color: "transparent",
            }
        }
        return {
            color: fontColor,
            WebkitTextFillColor: fontColor,
            WebkitTextStroke: "0px transparent",
            background: "none",
        }
    }
    const getTextStyle = () => {
        switch (currentPhase) {
            case "invisible":
                return {
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "0px transparent",
                    background: "none",
                }
            case "outline":
                return {
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
                    background: "none",
                }
            case "filled":
                return getFilledStyle()
            default:
                return {
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "0px transparent",
                    background: "none",
                }
        }
    }
    const getImageStyle = (): React.CSSProperties => {
        switch (currentPhase) {
            case "invisible":
                return { opacity: 0 }
            case "outline":
                return { opacity: 0.15 }
            case "filled":
                return { opacity: 1 }
            default:
                return { opacity: 0 }
        }
    }
    const sharedContainerStyle: React.CSSProperties = {
        transform: `translateX(${moveX}px)`,
        transition: "none",
        cursor: hoverEnabled ? "default" : undefined,
    }
    const getFlickerLetterStyle = (): React.CSSProperties => {
        if (activeCfg.letterFlickerMode === "stroke") {
            if (currentPhase === "outline") {
                return {
                    opacity: 0,
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    WebkitTextStroke: "0px transparent",
                    background: "none",
                }
            }
            return {
                WebkitTextFillColor: "transparent",
                color: "transparent",
                WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
                background: "none",
                WebkitBackgroundClip: "unset" as any,
                backgroundClip: "unset" as any,
            }
        }
        return { opacity: activeCfg.letterFlickerOpacity / 100 }
    }
    const renderText = () => {
        if (
            !activeCfg.letterFlickerEnabled ||
            (currentPhase !== "filled" && currentPhase !== "outline") ||
            flickerLetters.size === 0
        ) {
            return text
        }
        return (text ?? "").split("").map((char: string, i: number) => {
            if (char.trim() === "" || !flickerLetters.has(i)) {
                return <span key={i}>{char}</span>
            }
            return (
                <span key={i} style={getFlickerLetterStyle()}>
                    {char}
                </span>
            )
        })
    }
    if (isImage) {
        return (
            <div
                ref={elementRef as React.RefObject<HTMLDivElement>}
                onMouseEnter={handleMouseEnter}
                style={{
                    width: "100%",
                    height: "100%",
                    ...sharedContainerStyle,
                    ...getImageStyle(),
                }}
            >
                {image ? (
                    <img
                        src={image}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : null}
            </div>
        )
    }
    const Tag = tag as TagType
    return (
        <Tag
            ref={elementRef as any}
            onMouseEnter={handleMouseEnter}
            style={{
                margin: 0,
                padding: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                ...sharedContainerStyle,
                ...font,
                ...getTextStyle(),
            }}
        >
            {renderText()}
        </Tag>
    )
}

// Reusable control schemas
const enterTriggerFields: any = {
    position: {
        title: "Position",
        type: ControlType.Enum,
        defaultValue: "above",
        options: ["above", "middle", "below"],
        optionTitles: ["Top", "Middle", "Bottom"],
        optionIcons: [
            "text-align-top",
            "text-align-middle",
            "text-align-bottom",
        ],
        displaySegmentedControl: true,
    } as any,
    replay: {
        title: "Replay",
        type: ControlType.Enum,
        defaultValue: "yes",
        options: ["yes", "no"],
        optionTitles: ["Yes", "No"],
        displaySegmentedControl: true,
    },
}
const enterOnlyFields: any = {
    restState: {
        title: "Rest State",
        type: ControlType.Enum,
        defaultValue: "filled",
        options: ["filled", "outline", "invisible"],
        optionTitles: ["Filled", "Outline", "Empty"],
        displaySegmentedControl: false,
    },
    delay: {
        title: "Start Delay",
        type: ControlType.Number,
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 0.1,
        displayStepper: true,
        unit: "s",
    },
}
const textFlickerControls: any = {
    ease: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: { type: "tween", duration: 5, ease: "linear" },
    },
    flickerCount: {
        title: "Flicker Count",
        type: ControlType.Number,
        defaultValue: 3,
        min: 1,
        max: 1000,
        step: 1,
        displayStepper: true,
    },
    showStroke: {
        title: "Show Stroke",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
    strokePosition: {
        title: "Stroke Position",
        type: ControlType.Enum,
        defaultValue: "start",
        options: ["start", "middle", "end"],
        optionTitles: ["Start", "Middle", "End"],
        optionIcons: [
            "direction-left",
            "direction-horizontal",
            "direction-right",
        ],
        displaySegmentedControl: true,
        hidden: (props: any) => !props.showStroke,
    } as any,
    strokeCount: {
        title: "Stroke Count",
        type: ControlType.Number,
        defaultValue: 1,
        min: 1,
        max: 1000,
        step: 1,
        displayStepper: true,
        hidden: (props: any) => !props.showStroke,
    },
    strokeColor: {
        title: "Stroke Color",
        type: ControlType.Color,
        defaultValue: "#ffffff",
        hidden: (props: any) => !props.showStroke,
    },
    strokeWidth: {
        title: "Stroke Width",
        type: ControlType.Number,
        defaultValue: 1.5,
        min: 0.5,
        max: 5,
        step: 0.5,
        displayStepper: true,
        hidden: (props: any) => !props.showStroke,
    },
    wordFlickerEnabled: {
        title: "Word Flicker",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    shakeEnabled: {
        title: "Shake",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props: any) => !props.wordFlickerEnabled,
    },
    shakeWidth: {
        title: "Width",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 100,
        step: 1,
        unit: "px",
        hidden: (props: any) =>
            !props.wordFlickerEnabled || !props.shakeEnabled,
    },
    shakeSpeed: {
        title: "Intensity",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        hidden: (props: any) =>
            !props.wordFlickerEnabled || !props.shakeEnabled,
    },
    letterFlickerEnabled: {
        title: "Letter Flicker",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    letterFlickerMode: {
        title: "Flicker Style",
        type: ControlType.Enum,
        defaultValue: "opacity",
        options: ["stroke", "opacity"],
        optionTitles: ["Stroke", "Opacity"],
        hidden: (props: any) => !props.letterFlickerEnabled,
    },
    letterFlickerOpacity: {
        title: "Opacity",
        type: ControlType.Number,
        defaultValue: 30,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        hidden: (props: any) =>
            !props.letterFlickerEnabled ||
            props.letterFlickerMode !== "opacity",
    },
    letterFlickerIntensity: {
        title: "Speed",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        hidden: (props: any) => !props.letterFlickerEnabled,
    },
}

const imageFlickerControls: any = {
    ease: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: { type: "tween", duration: 5, ease: "linear" },
    },
    flickerCount: {
        title: "Flicker Count",
        type: ControlType.Number,
        defaultValue: 4,
        min: 1,
        max: 1000,
        step: 1,
        displayStepper: true,
    },
    shakeEnabled: {
        title: "Shake",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    shakeWidth: {
        title: "Width",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 100,
        step: 1,
        unit: "px",
        hidden: (props: any) => !props.shakeEnabled,
    },
    shakeSpeed: {
        title: "Intensity",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        hidden: (props: any) => !props.shakeEnabled,
    },
}

addPropertyControls(OutlineFillText, {
    contentType: {
        title: "Content",
        type: ControlType.Enum,
        defaultValue: "text",
        options: ["text", "image"],
        optionTitles: ["Text", "Image"],
        displaySegmentedControl: true,
    },
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Lander Studio",
        hidden: (props) => props.contentType === "image",
    },
    image: {
        title: "Image",
        type: ControlType.Image,
        hidden: (props) => props.contentType !== "image",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        defaultValue: {
            fontFamily: "League Spartan",
            variant: "Medium",
            fontSize: 120,
            lineHeight: "1em",
            letterSpacing: "0em",
        } as any,
        controls: "extended",
        defaultFontType: "sans-serif",
        hidden: (props) => props.contentType === "image",
    },
    colorMode: {
        title: "Color Mode",
        type: ControlType.Enum,
        defaultValue: "solid",
        options: ["solid", "gradient"],
        optionTitles: ["Solid", "Gradient"],
        displaySegmentedControl: true,
        hidden: (props) => props.contentType === "image",
    },
    fontColor: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: "#57FF1F",
        hidden: (props) =>
            props.contentType === "image" || props.colorMode === "gradient",
    },
    gradientAngle: {
        title: "Angle",
        type: ControlType.Number,
        defaultValue: 90,
        min: 0,
        max: 360,
        step: 1,
        unit: "°",
        hidden: (props) =>
            props.contentType === "image" || props.colorMode !== "gradient",
    },
    gradientStart: {
        title: "From",
        type: ControlType.Color,
        defaultValue: "#ffffff",
        hidden: (props) =>
            props.contentType === "image" || props.colorMode !== "gradient",
    },
    gradientEnd: {
        title: "To",
        type: ControlType.Color,
        defaultValue: "#888888",
        hidden: (props) =>
            props.contentType === "image" || props.colorMode !== "gradient",
    },

    // ── Text: Enter Flicker ───────────────────────────────────────────────
    textEnterFlickerEnabled: {
        title: "Enter Flicker",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props: any) => props.contentType === "image",
    },
    flicker: {
        title: "Enter Flicker",
        type: ControlType.Object,
        hidden: (props: any) =>
            props.contentType === "image" || !props.textEnterFlickerEnabled,
        controls: {
            ...enterTriggerFields,
            ...enterOnlyFields,
            ...textFlickerControls,
        },
    },

    // ── Text: Hover Flicker ───────────────────────────────────────────────
    textHoverFlickerEnabled: {
        title: "Hover Flicker",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props: any) => props.contentType === "image",
    },
    flickerHover: {
        title: "Hover Flicker",
        type: ControlType.Object,
        hidden: (props: any) =>
            props.contentType === "image" || !props.textHoverFlickerEnabled,
        controls: textFlickerControls,
    },

    // ── Image: Enter Flicker ──────────────────────────────────────────────
    imageEnterFlickerEnabled: {
        title: "Enter Flicker",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props: any) => props.contentType !== "image",
    },
    flickerImage: {
        title: "Enter Flicker",
        type: ControlType.Object,
        hidden: (props: any) =>
            props.contentType !== "image" || !props.imageEnterFlickerEnabled,
        controls: {
            ...enterTriggerFields,
            ...enterOnlyFields,
            ...imageFlickerControls,
        },
    },

    // ── Image: Hover Flicker ──────────────────────────────────────────────
    imageHoverFlickerEnabled: {
        title: "Hover Flicker",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props: any) => props.contentType !== "image",
    },
    flickerImageHover: {
        title: "Hover Flicker",
        type: ControlType.Object,
        hidden: (props: any) =>
            props.contentType !== "image" || !props.imageHoverFlickerEnabled,
        controls: imageFlickerControls,
    },

    tag: {
        title: "Tag",
        type: ControlType.Enum,
        defaultValue: "h1",
        options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
        optionTitles: ["H1", "H2", "H3", "H4", "H5", "H6", "P"],
        hidden: (props) => props.contentType === "image",
    },
})

// Silence unused-var warning on DEFAULT_TEXT_CFG export-less helper.
void DEFAULT_TEXT_CFG
