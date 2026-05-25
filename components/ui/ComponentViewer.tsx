"use client"

import { useState } from "react"
import { componentRegistry, type ComponentSlug } from "@/lib/components"
import { supabase } from "@/lib/supabase"

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
            if (supabase) {
                await supabase.rpc("increment_click", { slug_param: slug })
            }
        } catch (e: any) {
            setError(e?.message ?? "Copy failed")
        }
    }

    return (
        <main className="min-h-screen w-full font-(family-name:--font-geist-sans)">
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-black mb-10">
                    {entry.name}
                </h1>
                <button
                    onClick={copyComponent}
                    className="min-w-48 px-6 py-3 text-sm font-medium tracking-wide border border-black bg-black text-white hover:bg-neutral-800"
                >
                    {copied ? "Component Copied" : "Copy Component"}
                </button>
                <div className="mt-4 h-5 text-sm">
                    {error ? (
                        <span className="text-red-600">{error}</span>
                    ) : copied ? (
                        <span className="text-neutral-700">
                            Component copied, directly paste it in Framer
                        </span>
                    ) : null}
                </div>
            </div>
        </main>
    )
}
