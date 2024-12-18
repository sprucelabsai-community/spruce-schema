export default function flattenValues(values: Record<string, any>) {
    const flattened: Record<string, any> = flattenValue(values)
    return flattened
}

function flattenValue(values: Record<string, any>, prefix = '') {
    const keys = Object.keys(values)
    let flattened: Record<string, any> = {}
    for (const key of keys) {
        const value = values[key]
        const dotKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'object') {
            flattened = { ...flattened, ...flattenValue(value, dotKey) }
        } else {
            flattened[dotKey] = value
        }
    }
    return flattened
}
