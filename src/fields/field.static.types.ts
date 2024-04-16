import {
    FieldDefinitions,
    FieldMap,
    FieldValueTypeGeneratorMap,
} from '#spruce/schemas/fields/fields.types'
import { FieldError } from '../errors/options.types'
import {
    Schema,
    SchemaFieldsByName,
    SchemaValues,
    StaticSchemaEntity,
} from '../schemas.static.types'
import { Unpack, IsArray, IsRequired } from '../types/utilities.types'

export type SchemasById = Record<string, Schema[]>

export type SchemaFieldUnion<
    S extends Schema[],
    CreateEntityInstances extends boolean = false,
> = {
    [K in keyof S]: S[K] extends Schema
        ? CreateEntityInstances extends true
            ? StaticSchemaEntity<S[K]>
            : {
                  schemaId: S[K]['id']
                  version?: S[K]['version']
                  values: SchemaValues<S[K]>
              }
        : any
}

export interface FieldDefinitionToSchemaOptions {
    /** All definitions we're validating against */
    schemasById?: SchemasById
}

export type ToValueTypeOptions<
    F extends FieldDefinitions,
    CreateEntityInstances extends boolean = true,
> = {
    schemasById?: SchemasById
    createEntityInstances?: CreateEntityInstances
} & Partial<F['options']>

/** Options passed to validate() */
export type ValidateOptions<F extends FieldDefinitions> = {
    /** All schemas we're validating against */
    schemasById?: SchemasById
} & Partial<F['options']>

export type FieldType = keyof FieldMap
export type FieldName<F extends SchemaFieldsByName> = Extract<keyof F, string>

// if it's not going to change, put it in here
export type FieldDefinition<
    Value = any,
    DefaultValue = Value,
    ArrayValue = Value[],
    DefaultArrayValue = DefaultValue[],
> = {
    type: FieldType
    /** Default options are empty */

    options?: {}
    isPrivate?: boolean
    label?: string
    hint?: string
    isRequired?: boolean
    minArrayLength?: number
} & (
    | {
          isArray: true
          defaultValue?: DefaultArrayValue | null
          value?: ArrayValue | null
      }
    | {
          isArray?: false | undefined
          defaultValue?: DefaultValue | null
          value?: Value | null
      }
)

export type FieldDefinitionValueType<
    F extends FieldDefinitions,
    CreateEntityInstances extends boolean = false,
    ShouldIncludeNullAndUndefinedFields extends boolean = false,
> = F extends FieldDefinitions
    ? IsRequired<
          IsArray<
              NonNullable<
                  FieldValueTypeGeneratorMap<
                      F,
                      CreateEntityInstances,
                      ShouldIncludeNullAndUndefinedFields
                  >[F['type']]
              >,
              F['isArray']
          >,
          F['isRequired']
      >
    : any

export interface Field<F extends FieldDefinitions> {
    readonly definition: F
    readonly type: F['type']
    readonly options: F['options']
    readonly isRequired: F['isRequired']
    readonly isPrivate: F['isPrivate']
    readonly isArray: F['isArray']
    readonly minArrayLength: F['minArrayLength']
    readonly label: F['label']
    readonly hint: F['hint']
    name: string
    validate(value: any, options?: ValidateOptions<F>): FieldError[]
    toValueType<CreateEntityInstances extends boolean>(
        value: any,
        options?: ToValueTypeOptions<F, CreateEntityInstances>
    ): Unpack<
        Exclude<
            FieldDefinitionValueType<F, CreateEntityInstances>,
            undefined | null
        >
    >
}

export type FieldSubclass<F extends FieldDefinitions> = new (
    name: string,
    definition: F
) => Field<F>
