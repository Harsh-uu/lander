export const ControlType = new Proxy(
    {},
    { get: (_t, prop) => prop as string }
) as Record<string, string>

export function addPropertyControls(_component: unknown, _controls: unknown) {}
