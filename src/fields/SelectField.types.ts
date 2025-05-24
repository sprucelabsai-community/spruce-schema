import { FieldDefinition } from './field.static.types'

export type SelectValue = string | number

export interface SelectChoice {
    /**  Machine readable way to identify this choice */
    value: SelectValue
    label: string
}

export interface SelectFieldOptions {
    choices: SelectChoice[]
}

export type SelectFieldValueTypeMapper<F extends SelectFieldDefinition> =
    F['options']['choices'][number]['value']

export type SelectFieldDefinition = FieldDefinition<
    string,
    string,
    string[],
    string[]
> & {
    /** * .Select - A way to chose between a choices */
    type: 'select'
    options: SelectFieldOptions
}
