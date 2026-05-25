"use client"

import { useEffect, useRef, useState } from "react"
import { toSvg } from "html-to-image"
import { componentRegistry, type ComponentSlug } from "@/lib/components"

type CopyTarget = "framer" | "figma"

export default function ComponentViewer({ slug }: { slug: ComponentSlug }) {
    const entry = componentRegistry[slug]
    const Component = entry.Component as React.ComponentType<any>
    const previewRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState<CopyTarget | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const flash = (target: CopyTarget) => {
        setCopied(target)
        setError(null)
        setTimeout(() => setCopied(null), 2000)
    }

    const copyForFramer = async () => {
        const text = `/*
 * ${entry.name}
 *
 * Learn More: https://www.framer.com/asset-urls
 */

export * from "${entry.framerUrl}"
export { default } from "${entry.framerUrl}"`
        try {
            await navigator.clipboard.writeText(text)
            flash("framer")
        } catch (e: any) {
            setError(e?.message ?? "Copy failed")
        }
    }

    const copyForFigma = async () => {
        if (!previewRef.current) return
        try {
            const svgDataUrl = await toSvg(previewRef.current)
            const svgString = decodeURIComponent(svgDataUrl.split(",")[1])
            const blob = new Blob([svgString], { type: "image/svg+xml" })
            await navigator.clipboard.write([
                new ClipboardItem({ "image/svg+xml": blob }),
            ])
            flash("figma")
        } catch (e: any) {
            setError(e?.message ?? "Copy failed")
        }
    }

    return (
        <div style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
                {entry.name}
            </h1>

            <div
                ref={previewRef}
                style={{
                    width: "100%",
                    height: 480,
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#fafafa",
                    marginBottom: 20,
                }}
            >
                {mounted && <Component />}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <button
                    onClick={copyForFramer}
                    style={{
                        padding: "10px 18px",
                        borderRadius: 6,
                        border: "1px solid #0070f3",
                        background: copied === "framer" ? "#0070f3" : "white",
                        color: copied === "framer" ? "white" : "#0070f3",
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    {copied === "framer" ? "Copied!" : "Copy for Framer"}
                </button>
                <button
                    onClick={copyForFigma}
                    style={{
                        padding: "10px 18px",
                        borderRadius: 6,
                        border: "1px solid #111",
                        background: copied === "figma" ? "#111" : "white",
                        color: copied === "figma" ? "white" : "#111",
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    {copied === "figma" ? "Copied!" : "Copy for Figma"}
                </button>
            </div>

            {error && (
                <p style={{ color: "#d00", marginTop: 12, fontSize: 13 }}>
                    {error}
                </p>
            )}
        </div>
    )
}
