"use client"

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useId, useRef, useState } from "react"

function containRect(iW: number, iH: number, cW: number, cH: number) {
    const a = iW / iH,
        b = cW / cH
    return a > b
        ? {
              x: 0,
              y: Math.round((cH - cW / a) / 2),
              w: cW,
              h: Math.round(cW / a),
          }
        : {
              x: Math.round((cW - cH * a) / 2),
              y: 0,
              w: Math.round(cH * a),
              h: cH,
          }
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 200
 */
export default function ParticleImageMask(props: any) {
    const {
        imageConfig,
        bgColor,
        colorMode,
        particleColor,
        particleSize,
        density,
        speed,
        hoverEnabled,
        hoverRadius,
        hoverStrength,
        width,
        height,
        style,
    } = props

    const {
        image,
        mode = "fill",
        sizeUnit = "%",
        widthPx = 400,
        heightPx = 400,
        widthPct = 100,
        heightPct = 100,
        scale = 10,
    } = (imageConfig as any) || {}

    const [dims, setDims] = useState({ W: 0, H: 0 })
    const w = dims.W
    const h = dims.H

    // Density 0-100 → particle count 0-8000.
    const particleCount = Math.round(
        Math.max(0, Math.min(100, density ?? 0)) * 80
    )

    const gooStrength = 5
    const breakChance = 50

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const particlesRef = useRef<any[]>([])
    const mouseRef = useRef({ x: -9999, y: -9999, active: false })
    const rafRef = useRef<number | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [imgReady, setImgReady] = useState(false)
    const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "-")
    const filterId = `liquid-goo-${reactId}`

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const r = entries[0]?.contentRect
            if (!r) return
            const W = Math.round(r.width)
            const H = Math.round(r.height)
            if (!W || !H) return
            setDims({ W, H })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        if (!image) {
            imageRef.current = null
            setImgReady(false)
            return
        }
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            imageRef.current = img
            setImgReady(true)
        }
        img.onerror = () => {
            imageRef.current = null
            setImgReady(false)
        }
        img.src = image
    }, [image])

    const getImgRect = (img: HTMLImageElement) => {
        if (mode === "fit") {
            const base = containRect(
                img.naturalWidth || img.width,
                img.naturalHeight || img.height,
                w,
                h
            )
            const f = Math.max(1, Math.min(20, scale)) / 10
            const dw = base.w * f
            const dh = base.h * f
            return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
        }
        if (sizeUnit === "px") {
            const dw = Math.min(widthPx, w)
            const dh = Math.min(heightPx, h)
            return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
        }
        const dw = (w * widthPct) / 100
        const dh = (h * heightPct) / 100
        return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
    }

    // Distance field from nearest alpha=0 pixel of the image mask.
    // Used per-particle to taper size near alpha boundaries so internal
    // gaps and outlines look soft instead of jagged-edged.
    const distRef = useRef<Float32Array | null>(null)

    useEffect(() => {
        if (!imgReady || !w || !h) {
            distRef.current = null
            return
        }
        const img = imageRef.current
        if (!img) {
            distRef.current = null
            return
        }
        const off = document.createElement("canvas")
        off.width = w
        off.height = h
        const oCtx = off.getContext("2d", { willReadFrequently: true })
        if (!oCtx) return
        const { dx, dy, dw, dh } = getImgRect(img)
        oCtx.drawImage(img, dx, dy, dw, dh)
        let data: Uint8ClampedArray
        try {
            data = oCtx.getImageData(0, 0, w, h).data
        } catch {
            distRef.current = null
            return
        }
        const ALPHA_THR = 50
        const dist = new Float32Array(w * h)
        const INF = 1e9
        for (let i = 0; i < w * h; i++) {
            dist[i] = data[i * 4 + 3] < ALPHA_THR ? 0 : INF
        }
        const D1 = 1
        const D2 = 1.4142
        // Forward pass.
        for (let y = 1; y < h; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x
                let v = dist[i]
                if (dist[i - w] + D1 < v) v = dist[i - w] + D1
                if (dist[i - 1] + D1 < v) v = dist[i - 1] + D1
                if (dist[i - w - 1] + D2 < v) v = dist[i - w - 1] + D2
                if (dist[i - w + 1] + D2 < v) v = dist[i - w + 1] + D2
                dist[i] = v
            }
        }
        // Backward pass.
        for (let y = h - 2; y >= 0; y--) {
            for (let x = w - 2; x >= 1; x--) {
                const i = y * w + x
                let v = dist[i]
                if (dist[i + w] + D1 < v) v = dist[i + w] + D1
                if (dist[i + 1] + D1 < v) v = dist[i + 1] + D1
                if (dist[i + w + 1] + D2 < v) v = dist[i + w + 1] + D2
                if (dist[i + w - 1] + D2 < v) v = dist[i + w - 1] + D2
                dist[i] = v
            }
        }
        distRef.current = dist
    }, [
        imgReady,
        w,
        h,
        mode,
        sizeUnit,
        widthPx,
        heightPx,
        widthPct,
        heightPct,
        scale,
    ])

    const sampleSpawnX = (): number => {
        const img = imageRef.current
        if (!img) return Math.random() * w
        const rect = getImgRect(img)
        return rect.dx + Math.random() * rect.dw
    }

    const makeBlobShape = () => {
        const pts = 6 + Math.floor(Math.random() * 4)
        const radii: number[] = []
        for (let i = 0; i < pts; i++) {
            radii.push(0.7 + Math.random() * 0.5)
        }
        return radii
    }

    const spawnAtBottom = (p: any) => {
        p.x = sampleSpawnX()
        p.y = h + Math.random() * (h * 0.15)
        p.vx = (Math.random() - 0.5) * 0.25
        // Spawn at terminal speed so density stays uniform across vertical span.
        p.vy = -(0.9 + Math.random() * 0.3)
        p.baseSize = 0.75 + Math.random() * 0.7
        p.jitterPhase = Math.random() * Math.PI * 2
        p.jitterAmp = 0.015 + Math.random() * 0.03
        p.direction = "up"
    }

    const spawnAtTop = (p: any) => {
        p.x = sampleSpawnX()
        p.y = -Math.random() * (h * 0.15)
        p.vx = (Math.random() - 0.5) * 0.25
        p.vy = 0.9 + Math.random() * 0.3
        p.baseSize = 0.75 + Math.random() * 0.7
        p.jitterPhase = Math.random() * Math.PI * 2
        p.jitterAmp = 0.015 + Math.random() * 0.03
        p.direction = "down"
    }

    useEffect(() => {
        if (!w || !h) return
        const list = []
        for (let i = 0; i < particleCount; i++) {
            const p: any = {
                shape: makeBlobShape(),
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
            }
            // Alternate rising / falling so two layers coexist.
            if (i % 2 === 0) spawnAtBottom(p)
            else spawnAtTop(p)
            // Stagger initial positions vertically.
            p.y = Math.random() * h
            list.push(p)
        }
        particlesRef.current = list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [particleCount, w, h, imgReady])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !w || !h) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const speedMul = 0.05 + Math.pow((speed - 1) / 9, 1.3) * 2.35
        let last = performance.now()

        const drawBlob = (
            cx: number,
            cy: number,
            baseR: number,
            radii: number[],
            rotation: number
        ) => {
            const n = radii.length
            const angleStep = (Math.PI * 2) / n
            const pts: [number, number][] = []
            for (let i = 0; i < n; i++) {
                const a = rotation + i * angleStep
                const r = baseR * radii[i]
                pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
            }
            const firstPt = pts[0]
            const lastPt = pts[n - 1]
            const midStartX = (lastPt[0] + firstPt[0]) / 2
            const midStartY = (lastPt[1] + firstPt[1]) / 2
            ctx.beginPath()
            ctx.moveTo(midStartX, midStartY)
            for (let i = 0; i < n; i++) {
                const curr = pts[i]
                const next = pts[(i + 1) % n]
                const mx = (curr[0] + next[0]) / 2
                const my = (curr[1] + next[1]) / 2
                ctx.quadraticCurveTo(curr[0], curr[1], mx, my)
            }
            ctx.closePath()
            ctx.fill()
        }

        const computeImgRect = (img: HTMLImageElement) => {
            if (mode === "fit") {
                const base = containRect(
                    img.naturalWidth || img.width,
                    img.naturalHeight || img.height,
                    w,
                    h
                )
                const f = Math.max(1, Math.min(20, scale)) / 10
                const dw = base.w * f
                const dh = base.h * f
                return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
            }
            if (sizeUnit === "px") {
                const dw = Math.min(widthPx, w)
                const dh = Math.min(heightPx, h)
                return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
            }
            const dw = (w * widthPct) / 100
            const dh = (h * heightPct) / 100
            return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh }
        }

        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05)
            last = now
            ctx.globalCompositeOperation = "source-over"
            ctx.clearRect(0, 0, w, h)

            const particles = particlesRef.current
            const mouse = mouseRef.current
            const breakProb = (breakChance / 100) * dt

            const useImage =
                colorMode !== "custom" && imageRef.current !== null
            ctx.fillStyle = useImage ? "#000" : particleColor
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                // No acceleration — particles maintain spawn velocity so
                // distribution stays uniform across the vertical span.
                if (p.direction === "down") {
                    if (p.vy > 1.6) p.vy = 1.6
                } else {
                    if (p.vy < -1.6) p.vy = -1.6
                }

                // Side-to-side wobble — sinusoidal flow.
                p.vx +=
                    Math.sin(p.jitterPhase + now * 0.0015) * p.jitterAmp
                p.vx *= 0.96

                // Random break: rare impulse causing the blob to break away.
                if (Math.random() < breakProb) {
                    p.vx += (Math.random() - 0.5) * 1.8
                    p.vy += (Math.random() - 0.5) * 0.6
                }

                if (hoverEnabled && mouse.active) {
                    const dx = p.x - mouse.x
                    const dy = p.y - mouse.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < hoverRadius && dist > 0.001) {
                        const f = (1 - dist / hoverRadius) * hoverStrength
                        const nx = dx / dist
                        const ny = dy / dist
                        p.x += nx * f * 1.1
                        p.y += ny * f * 0.4
                    }
                }

                p.x += p.vx * speedMul * 60 * dt
                p.y += p.vy * speedMul * 60 * dt
                p.rotation += p.rotSpeed * speedMul

                // Lifetime by vertical progress: big near bottom, smaller as rising.
                // Vertical edge taper (top/bottom canvas edges).
                const edgeBand = h * 0.15
                const distFromEdge = Math.min(p.y, h - p.y)
                const vertFactor =
                    distFromEdge >= edgeBand
                        ? 1
                        : Math.max(0.25, distFromEdge / edgeBand)
                // Alpha-boundary taper using precomputed distance field.
                const distMap = distRef.current
                let alphaFactor = 1
                if (distMap) {
                    const ix = Math.max(0, Math.min(w - 1, Math.floor(p.x)))
                    const iy = Math.max(0, Math.min(h - 1, Math.floor(p.y)))
                    const d = distMap[iy * w + ix]
                    const band = particleSize * 1.5
                    alphaFactor = Math.max(0.25, Math.min(1, d / band))
                }
                const sizeFactor = Math.min(vertFactor, alphaFactor)

                const margin = particleSize * 2
                if (p.direction === "down") {
                    if (p.y > h + margin) spawnAtTop(p)
                } else {
                    if (p.y < -margin) spawnAtBottom(p)
                }
                if (p.x < -margin) p.x = w + margin
                if (p.x > w + margin) p.x = -margin

                drawBlob(
                    p.x,
                    p.y,
                    particleSize * p.baseSize * sizeFactor,
                    p.shape,
                    p.rotation
                )
            }

            const img = imageRef.current
            if (img) {
                const { dx, dy, dw, dh } = computeImgRect(img)
                if (useImage) {
                    ctx.globalCompositeOperation = "source-in"
                    ctx.drawImage(img, dx, dy, dw, dh)
                } else {
                    // Custom: clip particles to image alpha shape so
                    // transparent areas of PNG don't get filled.
                    ctx.globalCompositeOperation = "destination-in"
                    ctx.drawImage(img, dx, dy, dw, dh)
                }
                ctx.globalCompositeOperation = "source-over"
            }

            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        }
    }, [
        w,
        h,
        speed,
        colorMode,
        particleColor,
        particleSize,
        hoverEnabled,
        hoverRadius,
        hoverStrength,
        breakChance,
        imgReady,
        mode,
        sizeUnit,
        widthPx,
        heightPx,
        widthPct,
        heightPct,
        scale,
    ])

    // Gooey CSS filter. Blur tightly capped so no merged goo can exceed
    // roughly 2× particle size — high density makes many small clusters,
    // not one giant blob.
    const filterActive = gooStrength > 0
    const blur = Math.max(
        0.3,
        Math.min(particleSize * 0.35, gooStrength * 0.35)
    )
    // Sharper threshold (mult 18 offset 7 → alpha > 0.39) so only strongly
    // overlapping particles fuse, preventing far-reaching merge chains.
    const matrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7`

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width,
                height,
                overflow: "hidden",
                background: bgColor,
                ...style,
            }}
            onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect()
                if (!rect) return
                mouseRef.current.x = e.clientX - rect.left
                mouseRef.current.y = e.clientY - rect.top
                mouseRef.current.active = true
            }}
            onMouseLeave={() => {
                mouseRef.current.active = false
                mouseRef.current.x = -9999
                mouseRef.current.y = -9999
            }}
        >
            <svg
                aria-hidden
                style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <filter id={filterId} colorInterpolationFilters="sRGB">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation={blur}
                            result="blur"
                        />
                        <feColorMatrix in="blur" values={matrix} result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    filter: filterActive ? `url(#${filterId})` : "none",
                }}
            />
        </div>
    )
}

ParticleImageMask.defaultProps = {
    bgColor: "transparent",
    colorMode: "original",
    particleSize: 14,
    particleColor: "#ffffff",
    density: 30,
    speed: 4,
    hoverEnabled: false,
    hoverRadius: 90,
    hoverStrength: 4,
}

addPropertyControls(ParticleImageMask, {
    imageConfig: {
        type: ControlType.Object,
        title: "Image",
        controls: {
            image: { type: ControlType.Image, title: "Image" },
            mode: {
                type: ControlType.Enum,
                title: "Mode",
                defaultValue: "fill",
                options: ["fill", "fit"],
                optionTitles: ["Fill", "Fit"],
                displaySegmentedControl: true,
            },
            sizeUnit: {
                type: ControlType.Enum,
                title: "Size",
                defaultValue: "%",
                options: ["px", "%"],
                optionTitles: ["px", "%"],
                displaySegmentedControl: true,
                hidden: (props: any) => props.mode === "fit",
            },
            widthPx: {
                type: ControlType.Number,
                title: "Width",
                defaultValue: 400,
                min: 1,
                max: 4000,
                step: 1,
                unit: "px",
                hidden: (props: any) =>
                    props.mode === "fit" || props.sizeUnit !== "px",
            },
            heightPx: {
                type: ControlType.Number,
                title: "Height",
                defaultValue: 400,
                min: 1,
                max: 4000,
                step: 1,
                unit: "px",
                hidden: (props: any) =>
                    props.mode === "fit" || props.sizeUnit !== "px",
            },
            widthPct: {
                type: ControlType.Number,
                title: "Width",
                defaultValue: 100,
                min: 1,
                max: 100,
                step: 1,
                unit: "%",
                hidden: (props: any) =>
                    props.mode === "fit" || props.sizeUnit === "px",
            },
            heightPct: {
                type: ControlType.Number,
                title: "Height",
                defaultValue: 100,
                min: 1,
                max: 100,
                step: 1,
                unit: "%",
                hidden: (props: any) =>
                    props.mode === "fit" || props.sizeUnit === "px",
            },
            scale: {
                type: ControlType.Number,
                title: "Scale",
                defaultValue: 10,
                min: 1,
                max: 20,
                step: 1,
                hidden: (props: any) => props.mode !== "fit",
            },
        },
    },
    colorMode: {
        type: ControlType.Enum,
        title: "Particle Color",
        defaultValue: "original",
        options: ["original", "custom"],
        optionTitles: ["Original", "Custom"],
        displaySegmentedControl: true,
    },
    particleColor: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#ffffff",
        hidden: (props: any) => props.colorMode !== "custom",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "transparent",
    },
    density: {
        type: ControlType.Number,
        title: "Density",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        defaultValue: 30,
    },
    particleSize: {
        type: ControlType.Number,
        title: "Size",
        min: 1,
        max: 60,
        step: 0.5,
        unit: "px",
        defaultValue: 14,
    },
    speed: {
        type: ControlType.Number,
        title: "Rise Speed",
        min: 1,
        max: 10,
        step: 1,
        displayStepper: true,
        defaultValue: 4,
    },
    hoverEnabled: {
        type: ControlType.Boolean,
        title: "Hover",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    hoverRadius: {
        type: ControlType.Number,
        title: "Hover Area",
        min: 10,
        max: 300,
        step: 1,
        unit: "px",
        defaultValue: 90,
        hidden: (props: any) => !props.hoverEnabled,
    },
    hoverStrength: {
        type: ControlType.Number,
        title: "Hover Push",
        min: 0,
        max: 20,
        step: 0.5,
        defaultValue: 4,
        hidden: (props: any) => !props.hoverEnabled,
    },
})
