import { notFound } from "next/navigation"
import { componentRegistry, type ComponentSlug } from "@/lib/components"
import ComponentViewer from "@/components/ui/ComponentViewer"

export function generateStaticParams() {
    return Object.keys(componentRegistry).map((componentName) => ({
        componentName,
    }))
}

export default async function ComponentPage({
    params,
}: {
    params: Promise<{ componentName: string }>
}) {
    const { componentName } = await params
    const entry = componentRegistry[componentName as ComponentSlug]
    if (!entry) notFound()
    return <ComponentViewer slug={componentName as ComponentSlug} />
}
