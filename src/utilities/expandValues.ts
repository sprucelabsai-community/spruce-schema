export default function expandValues(
    values: Record<string, any> = {}
): Record<string, any> {
    const result: Record<string, any> = {}

    for (const key in values) {
        const value = values[key]
        const keys = key.split('.')

        let current = result

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]

            if (i === keys.length - 1) {
                current[k] = value
            } else {
                if (!(k in current) || typeof current[k] !== 'object') {
                    current[k] = {}
                }
                current = current[k]
            }
        }
    }

    return result
}
