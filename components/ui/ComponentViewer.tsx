"use client"

import Link from "next/link"
import { useState } from "react"
import { componentRegistry, type ComponentSlug } from "@/lib/components"

export default function ComponentViewer({ slug }: { slug: ComponentSlug }) {
    const entry = componentRegistry[slug]
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const copyComponent = async () => {
        try {
            await navigator.clipboard.writeText(entry.framerUrl)
            setError(null)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e: any) {
            setError(e?.message ?? "Copy failed")
        }
    }

    return (
        <main className="min-h-screen w-full relative font-(family-name:--font-geist-sans)">
            <Link
                href="/"
                aria-label="Back to all components"
                className="group absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-widest border border-black bg-black text-white hover:bg-neutral-800"
            >
                <span className="transition-transform group-hover:-translate-x-0.5">
                    ←
                </span>
                Back
            </Link>

            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-black mb-10">
                    {entry.name}
                </h1>
                <button
                    onClick={copyComponent}
                    className="min-w-48 px-6 py-3 text-sm font-medium tracking-wide border border-black bg-black text-white hover:bg-neutral-800"
                >
                    {copied ? "Copied!" : "Copy Component"}
                </button>
                {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                )}
            </div>
        </main>
    )
}
