import SpruceError from '../errors/SpruceError'

export default class KeyMapper {
    private map: Record<string, any>
    public constructor(map: Record<string, any>) {
        this.map = map
    }

    public mapTo(values: Record<string, any>, options?: MapOptions) {
        return this._mapTo(
            values,
            this.map,
            options?.shouldThrowOnUnmapped ?? true
        )
    }

    public mapFrom(values: Record<string, any>, options?: MapOptions) {
        return this._mapFrom(
            values,
            this.map,
            options?.shouldThrowOnUnmapped ?? true
        )
    }

    public mapFieldNameTo(name: string) {
        if (!this.map[name]) {
            this.throwFieldsNotMapped([name])
        }
        return this.map[name]
    }

    private throwFieldsNotMapped(fields: string[]) {
        throw new SpruceError({
            code: 'FIELDS_NOT_MAPPED',
            fields,
        })
    }

    public mapFieldNameFrom(name: string): string {
        for (const key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                if (this.map[key] === name) {
                    return key
                }
            }
        }

        this.throwFieldsNotMapped([name])

        return 'never hit'
    }

    private _mapTo(
        values: Record<string, any>,
        map: Record<string, any>,
        shouldThrowOnUnmapped = true
    ) {
        const foundFields: string[] = []
        let target: any = {}
        for (const key in map) {
            if (values.hasOwnProperty(key)) {
                target[map[key]] = values[key]
                foundFields.push(key)
            }
        }

        const missingFields = Object.keys(values).filter(
            (key) => !foundFields.includes(key)
        )

        if (shouldThrowOnUnmapped && missingFields.length > 0) {
            this.throwFieldsNotMapped(missingFields)
        }

        return target
    }

    private _mapFrom(
        values: Record<string, any>,
        map: Record<string, any>,
        shouldThrowOnUnmapped = true
    ) {
        const foundFields: string[] = []
        let target: any = {}
        for (const targetKey in map) {
            const sourceKey = map[targetKey]

            if (values.hasOwnProperty(sourceKey)) {
                target[targetKey] = values[sourceKey]
                foundFields.push(sourceKey)
            }
        }

        const missingFields = Object.keys(values).filter(
            (key) => !foundFields.includes(key)
        )

        if (shouldThrowOnUnmapped && missingFields.length > 0) {
            this.throwFieldsNotMapped(missingFields)
        }

        return target
    }
}

export interface MapOptions {
    shouldThrowOnUnmapped: boolean
}
