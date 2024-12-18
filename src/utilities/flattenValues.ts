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
        const isWildCardIgnored = ignoreKeys?.includes(`*.${key}`) ?? false
        const dotKey = prefix && !isWildCardIgnored ? `${prefix}.${key}` : key
        if (shouldFlatten(value, ignoreKeys, key)) {
            flattened = {
                ...flattened,
                ...flattenValue(value, dotKey, ignoreKeys),
            }
        } else if (isWildCardIgnored) {
            flattened[prefix] = { ...flattened[prefix], [key]: value }
        } else {
            flattened[dotKey] = value
        }
    }
    return flattened
}
function shouldFlatten(
    value: any,
    ignoreKeys: string[] | undefined,
    key: string
) {
    return value && typeof value === 'object' && !ignoreKeys?.includes(key)
}
