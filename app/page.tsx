import Link from "next/link"
import { componentRegistry } from "@/lib/components"

export default function Home() {
    return (
        <div style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 24 }}>
                Components
            </h1>
            <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 16,
                    listStyle: "none",
                    padding: 0,
                }}
            >
                {Object.entries(componentRegistry).map(([slug, entry]) => (
                    <li key={slug}>
                        <Link
                            href={`/component/${slug}`}
                            style={{
                                display: "block",
                                padding: 20,
                                border: "1px solid #e5e5e5",
                                borderRadius: 8,
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <h2 style={{ fontSize: 18, fontWeight: 500 }}>
                                {entry.name}
                            </h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
