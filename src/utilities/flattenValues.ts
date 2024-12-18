export default function flattenValues(
    values: Record<string, any>,
    ignoreKeys?: string[]
) {
    const flattened: Record<string, any> = flattenValue(values, '', ignoreKeys)
    return flattened
}

function flattenValue(
    values: Record<string, any>,
    prefix = '',
    ignoreKeys?: string[]
) {
    const keys = Object.keys(values)
    let flattened: Record<string, any> = {}
    for (const key of keys) {
        const value = values[key]
        const dotKey = prefix ? `${prefix}.${key}` : key
        if (value && typeof value === 'object' && !ignoreKeys?.includes(key)) {
            flattened = { ...flattened, ...flattenValue(value, dotKey) }
        } else {
            flattened[dotKey] = value
        }
    }
    return flattened
}
