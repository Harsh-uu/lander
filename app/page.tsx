import Link from "next/link"
import { componentRegistry } from "@/lib/components"

export default function Home() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 font-(family-name:--font-geist-sans)">
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
                <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-black">
                    Framer Components
                </h1>

                <ul className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(componentRegistry).map(([slug, entry]) => (
                        <li key={slug}>
                            <Link
                                href={`/component/${slug}`}
                                className="block border border-black bg-black text-white px-6 py-8 text-center hover:bg-neutral-800"
                            >
                                <span className="text-lg font-medium tracking-wide">
                                    {entry.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}
