# @sprucelabs/schema

> Static and dynamic binding plus runtime validation and transformation to ensure your app is sound. 🤓

Define the shape of your data **once** and get everything else for free: bulletproof TypeScript types, runtime validation with human-friendly error messages, value normalization (coercing `'10'` → `10`, formatting phone numbers, truncating strings), default values, private fields, versioning, nested relationships, and even code generation for other languages.

If you've ever kept an interface, a validator, and a sanitizer in sync by hand — this library exists so you never have to again.

```bash
yarn add @sprucelabs/schema
# or
npm install @sprucelabs/schema
```

Full platform docs: [developer.spruce.ai](https://developer.spruce.ai/#/schemas/index)

---

## Table of contents

- [Quick start](#quick-start)
- [Core concepts](#core-concepts)
- [Field types](#field-types)
- [Building schemas](#building-schemas)
- [Validating values](#validating-values)
- [Normalizing values](#normalizing-values)
- [Default values](#default-values)
- [Schema entities](#schema-entities)
- [Dynamic schemas](#dynamic-schemas)
- [Nested schemas & relationships](#nested-schemas--relationships)
- [Dot notation](#dot-notation)
- [The schema registry & versioning](#the-schema-registry--versioning)
- [TypeScript type helpers](#typescript-type-helpers)
- [Errors](#errors)
- [Utilities](#utilities)
- [Testing helpers](#testing-helpers)
- [Custom field types](#custom-field-types)
- [Code generation](#code-generation)
- [Gotchas & good-to-knows](#gotchas--good-to-knows)
- [Contributing / local development](#contributing--local-development)

---

## Quick start

```ts
import {
    buildSchema,
    validateSchemaValues,
    normalizeSchemaValues,
    SchemaValues,
} from '@sprucelabs/schema'

// 1. Define a schema (a plain object — buildSchema preserves its literal type)
const personSchema = buildSchema({
    id: 'person',
    name: 'Person',
    fields: {
        firstName: { type: 'text', label: 'First name', isRequired: true },
        lastName: { type: 'text', label: 'Last name' },
        age: { type: 'number' },
        phone: { type: 'phone' },
        favoriteColors: { type: 'text', isArray: true, minArrayLength: 0 },
    },
})

// 2. Get the TypeScript type for free
type Person = SchemaValues<typeof personSchema>
// { firstName: string; lastName?: string | null; age?: number | null;
//   phone?: string | null; favoriteColors?: string[] | null }

// 3. Validate untrusted values (throws VALIDATION_FAILED with friendly messages)
const values = { firstName: 'Tay', age: '32' as any }
validateSchemaValues(personSchema, values)
// after this line, TypeScript narrows `values` to a full Person ✨

// 4. Normalize/coerce loose input into typed values
const person = normalizeSchemaValues(personSchema, {
    firstName: 12345, // -> '12345'
    age: '10', // -> 10
    phone: '5555555555', // -> '+1 555-555-5555'
})
```

A failed validation renders like this:

```
'person' has 2 errors!

1. 'First name' is required!
2. '"whoops" is not a number!'
```

---

## Core concepts

**Schema** — a plain object literal describing your data. Only `id` is required, plus either `fields` (static) or `dynamicFieldSignature` (dynamic):

```ts
interface Schema {
    id: string
    name?: string // human-readable name
    version?: string // e.g. 'v2020_07_22'
    namespace?: string // e.g. 'MyOrg'
    description?: string
    fields?: Record<string, FieldDefinition> // static schemas
    dynamicFieldSignature?: FieldDefinition & { keyName: string } // dynamic schemas
    // ...plus codegen hints: importsWhenLocal, importsWhenRemote,
    // moduleToImportFromWhenRemote, typeSuffix
}
```

**Field definition** — describes one field. Every field type shares these options:

```ts
{
    type: 'text' | 'number' | 'boolean' | ... // see Field types below
    label?: string        // human label — used in error messages
    hint?: string         // help text — rendered as comments in generated types
    isRequired?: boolean
    isPrivate?: boolean   // strippable via dropPrivateFields / shouldIncludePrivateFields: false
    isArray?: boolean     // value becomes T[]; defaultValue/value become arrays too
    minArrayLength?: number  // defaults to 1 for required arrays — set 0 to allow []
    maxArrayLength?: number
    defaultValue?: ...    // surfaced by defaultSchemaValues() / getDefaultValues()
    value?: ...           // hardcoded initial value, applied on entity construction
    options?: ...         // per-field-type options (choices, valueType, schema, etc.)
}
```

**Entity** — a live wrapper around a schema + values with `get`/`set`/`validate`/`getValues` and friends. You usually don't need entities directly — the `validateSchemaValues`/`normalizeSchemaValues` utilities create them under the hood — but they're great for form-like flows.

**Static vs dynamic** — static schemas have named fields known at compile time; dynamic schemas accept *any* key, with all values sharing one field definition (think `Record<string, number>`).

---

## Field types

| `type` | Value type | Options | Notes |
|---|---|---|---|
| `text` | `string` | `minLength?`, `maxLength?` | Coerces numbers to strings; `maxLength` truncates on normalize |
| `boolean` | `boolean` | — | `'true'`/`'false'` strings convert; everything else is `!!value` |
| `number` | `number` | `min?`, `max?` | Coerces numeric strings (`'42'` → `42`) |
| `select` | union of choice values | `choices: { value, label }[]` (required) | Generated type is a literal union like `'small' \| 'large'` |
| `phone` | `string` | — | Formats to `+1 555-555-5555`; validates via `isValidNumber` |
| `email` | `string` | — | Validates format via `email-validator` |
| `date` | `number` (epoch ms) | — | Normalizes to **start of day, UTC** |
| `dateTime` | `number` (epoch ms) | `dateTimeFormat?: 'epoch' \| 'iso_8601'` | Accepts `Date`, ISO strings, timestamps |
| `duration` | `{ hours, minutes, seconds, ms }` | `durationFormat?`, `minDuration?`, `maxDuration?` | `buildDuration()` accepts ms, strings, or partial objects |
| `address` | `{ street1, street2?, city, province, country, zip }` | — | |
| `id` | `string` | — | Unique identifier (UUID4 in Spruce); stringifies on normalize |
| `file` | `{ name, id?, type?, uri?, base64?, previewUrl? }` | `acceptableTypes: SupportedFileType[]` | Mime types, incl. wildcards like `'image/*'` and `'*'` |
| `image` | `{ name, sUri?, mUri?, lUri?, xlUri?, base64?, ... }` | `requiredSizes: ('s'\|'m'\|'l'\|'xl'\|'*')[]` | `'*'` expands to all sizes; `base64` values skip the size check (upload path) |
| `directory` | `{ path: string }` | `relativeTo?: string` | Normalizes to a path relative to `relativeTo` when set |
| `raw` | whatever you say it is | `valueType: string` (required) | Escape hatch — the string is dropped verbatim into generated types; **no runtime validation** |
| `schema` | nested values / entity / union | `schema?`, `schemaId?`, `schemas?`, `schemaIds?`, `schemasCallback?`, `typeSuffix?` | See [Nested schemas](#nested-schemas--relationships) |

Some illustrative definitions:

```ts
const kitchenSinkSchema = buildSchema({
    id: 'kitchenSink',
    fields: {
        name: { type: 'text', isRequired: true, options: { maxLength: 50 } },
        status: {
            type: 'select',
            isRequired: true,
            defaultValue: 'draft',
            options: {
                choices: [
                    { value: 'draft', label: 'Draft' },
                    { value: 'live', label: 'Live' },
                ],
            },
        },
        tags: { type: 'text', isArray: true, minArrayLength: 0, maxArrayLength: 5 },
        lengthOfBooking: {
            type: 'duration',
            defaultValue: { hours: 1, minutes: 0, seconds: 0, ms: 0 },
        },
        attachment: {
            type: 'file',
            options: { acceptableTypes: ['application/pdf', 'image/*'] },
        },
        avatar: { type: 'image', options: { requiredSizes: ['s', 'm'] } },
        meta: { type: 'raw', options: { valueType: 'Record<string, any>' } },
        ssn: { type: 'text', isPrivate: true },
    },
})
```

Array rules worth knowing:

- A **required array field defaults to `minArrayLength: 1`** — `[]` fails validation. Set `minArrayLength: 0` to allow empty arrays.
- `maxArrayLength` caps how many values are allowed.
- A non-array value on an `isArray` field fails with `'X' must be an array!`.

Duration helpers are exported directly:

```ts
import { buildDuration, reduceDurationToMs } from '@sprucelabs/schema'

buildDuration({ hours: 2.52 }) // { hours: 2, minutes: 31, seconds: 12, ms: 0 }
buildDuration(90_000) // { hours: 0, minutes: 1, seconds: 30, ms: 0 }
reduceDurationToMs({ hours: 0, minutes: 1, seconds: 30, ms: 0 }) // 90000
```

---

## Building schemas

### `buildSchema(schema)`

An identity function with a very important generic: it **preserves the literal type** of what you pass, which is what makes `SchemaValues<typeof schema>`, field-name autocomplete, and select-choice unions all work. It also registers the schema in the [SchemaRegistry](#the-schema-registry--versioning).

### `buildErrorSchema(schema)`

Same literal-type trick, **without** registry tracking. Use it for error-option schemas so they don't pollute (or collide in) the registry.

### Composing schemas from other schemas

Four type-exact helpers operate on a schema's `fields` map:

```ts
import {
    buildSchema,
    dropFields,
    pickFields,
    dropPrivateFields,
    makeFieldsOptional,
} from '@sprucelabs/schema'

// CRUD-style variants of one canonical schema:
const createPersonSchema = buildSchema({
    id: 'createPerson',
    fields: dropFields(personSchema.fields, ['id']),
})

const updatePersonSchema = buildSchema({
    id: 'updatePerson',
    fields: makeFieldsOptional(dropFields(personSchema.fields, ['id'])),
})

const publicPersonSchema = buildSchema({
    id: 'publicPerson',
    fields: dropPrivateFields(personSchema.fields), // strips isPrivate: true
})

const personNameSchema = buildSchema({
    id: 'personName',
    fields: pickFields(personSchema.fields, ['firstName', 'lastName']),
})
```

All four work at both runtime **and** the type level — the resulting `SchemaValues` types reflect the dropped/optional fields exactly.

### `getFields(schema)`

Returns the field names typed as the schema's field-name union. Throws `INVALID_PARAMETERS` if the schema has no fields.

```ts
const names = getFields(personSchema) // ('firstName' | 'lastName' | ...)[]
```

---

## Validating values

### `validateSchemaValues(schema, values, options?)`

The workhorse. Throws a `SchemaError` with code `VALIDATION_FAILED` if anything is wrong — and it's an **assertion function**, so on success TypeScript narrows your partial values to the full `SchemaValues<S>`:

```ts
const values: SchemaPartialValues<typeof personSchema> = { firstName: 'Tay' }
validateSchemaValues(personSchema, values)
values.firstName // string — no longer string | undefined
```

Options:

- `fields?: SchemaFieldNames<S>[]` — validate only a subset:

```ts
validateSchemaValues(personSchema, values, { fields: ['firstName'] })
```

Dot-notation keys in `values` (`{ 'source.organizationId': 'abc' }`) are expanded before validation.

What gets checked, per field:

1. Unknown keys → `UNEXPECTED_PARAMETER` (`` `nope` does not exist. ``)
2. Required + missing → `MISSING_PARAMETER` (`'First name' is required!`)
3. Array fields: non-array value, fewer than `minArrayLength`, or more than `maxArrayLength` → `INVALID_PARAMETER`
4. Each value (or each array element) runs through the field's own validator — bad emails, invalid phone numbers, out-of-choices selects, malformed dates, wrong nested-schema shapes, etc.
5. Nested `schema` fields validate recursively — their errors nest inside the parent `FieldError.errors`.

### Non-throwing checks

```ts
import { areSchemaValuesValid, isSchemaValid, validateSchema } from '@sprucelabs/schema'

areSchemaValuesValid(personSchema, formValues) // boolean — values check
areSchemaValuesValid(personSchema, formValues, { fields: ['firstName'] })

isSchemaValid(maybeSchema) // type guard — is this object a valid *schema*?
validateSchema(maybeSchema) // asserting version — throws INVALID_SCHEMA
```

`validateSchema` checks the schema shell itself (`id` present and a string, `name` a string if present, and one of `fields`/`dynamicFieldSignature` set) and reports codes like `id_missing` and `needs_fields_or_dynamic_field_signature` inside the thrown error.

### Reading validation errors

The thrown error's `options.errors` is a tree of `FieldError`s:

```ts
interface FieldError {
    code: 'MISSING_PARAMETER' | 'INVALID_PARAMETER' | 'UNEXPECTED_PARAMETER'
    name: string // field name
    label?: string
    friendlyMessage?: string
    originalError?: Error
    errors?: FieldError[] // nested schema fields nest here
}
```

`err.message` renders a numbered, human-friendly list (dotted names for nested fields):

```
'person' has 2 errors!

1. 'firstName' is required
2. (requiredCar.name) 'This is required!'
```

To convert field errors into the aggregate parameter-error style used across the Spruce platform:

```ts
import { mapFieldErrorsToParameterErrors } from '@sprucelabs/schema'

const errors = mapFieldErrorsToParameterErrors(err.options.errors)
// up to 3 SchemaErrors: MISSING_PARAMETERS / INVALID_PARAMETERS / UNEXPECTED_PARAMETERS,
// each with parameters: ['firstName', 'source.organizationId', ...]
```

---

## Normalizing values

### `normalizeSchemaValues(schema, values, options?)`

Runs loose input through each field's transformer and hands back clean, typed values:

```ts
const person = normalizeSchemaValues(personSchema, {
    firstName: 12345, // -> '12345'
    age: '10', // -> 10
    boolean: 'false', // -> false
    phone: '5555555555', // -> '+1 555-555-5555'
})
```

Options (all optional):

| Option | Default | What it does |
|---|---|---|
| `shouldValidate` | `true` | Validate while normalizing (throws on bad values) |
| `shouldCreateEntityInstances` | `false` | Return entity instances for `schema` fields instead of plain objects |
| `fields` | all | Only include these fields (dot paths allowed — acts as a deep pick) |
| `excludeFields` | — | Drop these fields |
| `shouldIncludePrivateFields` | `true` | Pass literal `false` to strip `isPrivate` fields — the return **type** narrows too |
| `shouldIncludeNullAndUndefinedFields` | `true` | Pass `false` to omit unset/null keys entirely |
| `byField` | — | Per-field option overrides, e.g. `{ name: { maxLength: 10 } }` |
| `shouldRetainDotNotationKeys` | `false` | Keep output flat with dotted keys instead of nested |

```ts
// public projection
const publicPerson = normalizeSchemaValues(personSchema, record, {
    shouldIncludePrivateFields: false,
    fields: ['firstName', 'lastName'],
})

// per-call field option override — truncate on read
normalizeSchemaValues(personSchema, values, {
    byField: { firstName: { maxLength: 10 } },
})
```

---

## Default values

Fields that declare `defaultValue` can be materialized in one call:

```ts
import { defaultSchemaValues } from '@sprucelabs/schema'

defaultSchemaValues(kitchenSinkSchema)
// { status: 'draft', lengthOfBooking: { hours: 1, ... } }
// only fields WITH a defaultValue appear — and the type knows that:
// SchemaDefaultValues<S> picks exactly the defaulted field names
```

Note the difference between two similarly-named field options:

- `defaultValue` — only surfaced by `defaultSchemaValues()` / `entity.getDefaultValues()`.
- `value` — a hardcoded initial value that is `set()` automatically when an entity is constructed.

---

## Schema entities

Entities wrap a schema + values with a live API. Build them via the factory (it picks static vs dynamic for you):

```ts
import { SchemaEntityFactory } from '@sprucelabs/schema'

const person = SchemaEntityFactory.Entity(personSchema, { firstName: 'Tay' })
```

Or directly — `StaticSchemaEntityImpl` is also the package's default export:

```ts
import StaticSchemaEntityImpl from '@sprucelabs/schema'

const person = new StaticSchemaEntityImpl(personSchema, { firstName: 'Tay' })
```

### The API

```ts
person.get('firstName') // 'Tay' — normalized on read
person.set('firstName', 'Taylor') // normalized + validated on write; chainable
person.setValues({ firstName: 'Becca', age: 30 })

person.getValues() // everything, validated, entity instances for nested schemas
person.getValues({ shouldValidate: false }) // safe read of a partially-filled entity
person.getValues({ shouldCreateEntityInstances: false }) // plain objects for nested schemas
person.getValues({ shouldIncludePrivateFields: false }) // strip isPrivate fields
person.getValues({ fields: ['firstName'] }) // subset
person.getValues({ excludeFields: ['age'] })
person.getValues({ shouldIncludeNullAndUndefinedFields: false }) // omit unset keys

person.validate() // throws VALIDATION_FAILED with all field errors
person.isValid() // boolean
person.getDefaultValues() // fields with defaultValue, normalized

// introspection
for (const { name, field } of person.getNamedFields()) {
    console.log(name, field.type, field.isRequired, field.label, field.hint)
}
```

Per-call field option overrides work on `get` too:

```ts
person.set('firstName', 'a really long name that should get truncated')
person.get('firstName', { byField: { firstName: { maxLength: 10 } } }) // 'a really l'
```

Transformation happens **on read and write**:

```ts
entity.set('favoriteColors', [1, 2, 3]) // text[] -> ['1', '2', '3']
entity.set('age', ['9', '8']) // non-array field + array input -> takes [0] -> 9
```

⚠️ `get`/`getValues` validate by default — reading a required-but-unset field throws `MISSING_PARAMETERS`. Pass `{ shouldValidate: false }` for a safe read of an incomplete entity.

### `FieldFactory`

Build a single field instance when you need one outside a schema:

```ts
import { FieldFactory } from '@sprucelabs/schema'

const field = FieldFactory.Field('firstName', { type: 'text', isRequired: true })
field.validate(undefined) // [{ code: 'MISSING_PARAMETER', name: 'firstName' }]
field.toValueType(123) // '123'
```

---

## Dynamic schemas

When keys aren't known ahead of time but all values share one shape, use `dynamicFieldSignature` instead of `fields`:

```ts
const scoresSchema = buildSchema({
    id: 'scores',
    name: 'Scores by name',
    dynamicFieldSignature: { type: 'number', keyName: 'name', isRequired: true },
})

const scores = SchemaEntityFactory.Entity(scoresSchema, { taylor: 10, kayla: 12 })
scores.set('anyKeyAtAll', 5)
scores.getValues() // Record<string, number>
```

- The generated type follows the signature: optional → `{ [key: string]?: number }`, `isRequired: true` → `Record<string, number>`, `isArray: true` → `Record<string, number[]>`.
- `keyName` names the key in generated code/docs; `keyTypeLiteral` can narrow the key type during codegen. Neither is enforced at runtime.
- `normalizeSchemaValues` and `validateSchemaValues` work on dynamic schemas too (the factory picks `DynamicSchemaEntityImplementation` under the hood).

---

## Nested schemas & relationships

The `schema` field type maps relationships. Four ways to point at the related schema(s):

```ts
// 1. inline — full type inference flows through
address: { type: 'schema', isRequired: true, options: { schema: addressSchema } }

// 2. by id (+ optional version/namespace) — resolved via the SchemaRegistry at runtime
person: { type: 'schema', options: { schemaId: { id: 'person', version: 'v2020_07_22' } } }

// 3. union of schemas — values carry a discriminator
vehicle: { type: 'schema', options: { schemas: [carSchema, truckSchema] } }

// 4. lazy callback — for circular references
friend: { type: 'schema', options: { schemasCallback: () => [personSchema] } }
```

Arrays of relationships are just `isArray: true` on top:

```ts
cars: { type: 'schema', isArray: true, minArrayLength: 0, options: { schema: carSchema } }
```

**Union values** are shaped `{ id, version?, values }` so the library knows which schema to validate against:

```ts
person.set('vehicle', { id: 'car', values: { name: 'The Go-Kart' } })
```

**Reading nested values** — by default entities hydrate nested schemas into entity instances; utilities return plain objects:

```ts
const car = person.get('requiredCar') // StaticSchemaEntity — has .get()/.set()
car.get('name')

person.get('requiredCar', { shouldCreateEntityInstances: false }) // plain object
normalizeSchemaValues(personSchema, values) // plain objects (its default is false)
```

Nested validation errors nest: the parent field gets one `INVALID_PARAMETER` whose `errors` array holds the child's field errors, rendered with dotted names (`requiredCar.name`).

> Only inline `schema`/`schemas` options produce precise generated types — `schemaId`/`schemaIds` resolve to `any` at the type level and rely on the registry/codegen to fill in types.

---

## Dot notation

Several APIs speak dot notation for nested values:

```ts
import { flattenValues, expandValues } from '@sprucelabs/schema'

// normalize expands dotted input keys into nested objects
normalizeSchemaValues(eventSchema, {
    firstName: 'bob',
    'source.organizationId': orgId,
})
// -> { firstName: 'bob', source: { organizationId: orgId, ... } }

// keep the output flat instead
normalizeSchemaValues(eventSchema, values, { shouldRetainDotNotationKeys: true })

// dotted `fields` entries act as a deep pick
normalizeSchemaValues(eventSchema, values, { fields: ['source.organizationId'] })
// -> { source: { organizationId } }

// the raw pair
flattenValues({ a: { b: { c: 1 } } }) // { 'a.b.c': 1 }
expandValues({ 'a.b.c': 1 }) // { a: { b: { c: 1 } } }

// flattenValues ignore rules
flattenValues(values, ['payload']) // leave the payload subtree nested
flattenValues(values, ['*.organizationId']) // wildcard: keep any organizationId leaf grouped
```

`validateSchemaValues` also accepts dotted input keys, and `assertOptions` + `validationErrorAssert` accept dotted paths/names.

---

## The schema registry & versioning

`buildSchema()` tracks every schema in a process-wide singleton so `schemaId` references and codegen can find them:

```ts
import { SchemaRegistry, buildSchema } from '@sprucelabs/schema'

buildSchema({ id: 'wrench', version: 'v1', fields: { length: { type: 'number' } } })
buildSchema({ id: 'wrench', version: 'v2', fields: { length: { type: 'number' }, diameter: { type: 'number' } } })

const registry = SchemaRegistry.getInstance()

registry.getSchema('wrench', 'v2') // exact version match
registry.getSchema('wrench') // throws VERSION_NOT_FOUND (versions exist, none picked)
registry.getSchema('nope') // throws SCHEMA_NOT_FOUND
registry.isTrackingSchema('wrench', 'v1') // true
registry.getAllSchemas()
registry.getTrackingCount()
registry.forgetSchema('wrench', 'v1')
registry.forgetAllSchemas() // typical test beforeEach
SchemaRegistry.reset() // drop the singleton entirely
```

Things to know:

- **`DUPLICATE_SCHEMA`** is thrown when the same `(id, version, namespace)` is tracked twice — the classic symptom is a module calling `buildSchema()` at module scope getting imported twice, or test files sharing fixtures. Fix by calling `forgetAllSchemas()` in `beforeEach` (see [Testing helpers](#testing-helpers)).
- Tracking can be disabled entirely with the env var `SHOULD_USE_SCHEMA_REGISTRY=false`. It's read once at first `getInstance()` — call `SchemaRegistry.reset()` if you change it mid-process.
- Version matching is **exact**; a versionless schema and versioned schemas with the same id can coexist.
- Namespaces filter lookups when passed; when omitted, all namespaces are candidates.

Related identity helpers:

```ts
import { isIdWithVersion, normalizeSchemaToIdWithVersion, areSchemasTheSame } from '@sprucelabs/schema'

isIdWithVersion({ id: 'person' }) // true — a reference, not a full schema
normalizeSchemaToIdWithVersion(personSchema) // { id: 'person' } (+ version/namespace when set)
areSchemasTheSame(a, b) // shallow: compares id + sorted field names only
```

---

## TypeScript type helpers

All exported from the package root. The big ones:

| Type | What you get |
|---|---|
| `SchemaValues<S>` | The natural data type — required fields required, optional fields `?: T \| null` |
| `SchemaValues<S, true>` | Same, but `schema` fields become entity instances |
| `SchemaPartialValues<S>` | Everything optional and nullable — constructor/`setValues` input |
| `SchemaAllValues<S>` | Every key present (`-?`), values still nullable when optional |
| `SchemaDefaultValues<S>` | Only fields with `defaultValue`, non-nullable |
| `SchemaValuesWithDefaults<S>` | `SchemaValues & SchemaDefaultValues` |
| `SchemaPublicValues<S>` | `isPrivate` fields removed |
| `SchemaFieldNames<S>` | Union of field names |
| `SchemaRequiredFieldNames<S>` / `SchemaOptionalFieldNames<S>` | Name unions by required-ness |
| `SchemaFieldNamesWithDefaultValue<S>` | Names of defaulted fields |
| `SchemaPublicFieldNames<S>` | Non-private names |
| `PickFieldNames<S, 'select'>` | Names of fields of a given type |
| `SchemaFieldValueType<S, 'fieldName'>` | One field's value type |
| `SchemaIdWithVersion` | `{ id, version?, namespace? }` |
| `SchemaEntity` / `StaticSchemaEntity<S>` / `DynamicSchemaEntityByName<S>` | Entity contracts |
| `IsDynamicSchema<S>` | Type-level static/dynamic test |
| `Optional<T>` | Every property `?: T \| null` — matches how schemas express optionality |
| `Unpack<T>` / `IsArray<T, B>` / `IsRequired<T, B>` | The primitives field value types are built from |
| `ValuesWithPaths<T>` / `PathsWithDotNotation<T>` / `TypeAtPath<T, P>` | Dot-notation typing (depth 3) |

```ts
type Person = SchemaValues<typeof personSchema>
type PersonPatch = SchemaPartialValues<typeof personSchema>
type PublicPerson = SchemaValues<typeof personSchema, false, false>
type NameField = SchemaFieldValueType<typeof personSchema, 'firstName'> // string
```

---

## Errors

Everything throws `SchemaError` (a `SpruceError` from `@sprucelabs/error`) with a typed `options.code`. All option shapes are exported from the root (`FieldError`, `FieldErrorCode`, `ValidationError`, `SchemaErrorOptions`, and every `*Options` interface).

| Code | Thrown when | Key options |
|---|---|---|
| `VALIDATION_FAILED` | Values fail validation (`validateSchemaValues`, `entity.validate/set/getValues`) | `schemaId`, `schemaName?`, `errors: FieldError[]` |
| `INVALID_SCHEMA` | Schema shell is malformed (`validateSchema`, registry tracking) | `schemaId`, `errors: string[]` |
| `DUPLICATE_SCHEMA` | Same `(id, version, namespace)` tracked twice | `schemaId`, `version?`, `namespace?` |
| `SCHEMA_NOT_FOUND` | Registry lookup missed the id | `schemaId`, `version?`, `namespace?` |
| `VERSION_NOT_FOUND` | Id found, version didn't disambiguate | `schemaId?`, `namespace?` |
| `TRANSFORMATION_ERROR` | A value can't be coerced (`text`/`number`/`directory`/`schema`) | `fieldType`, `incomingTypeof`, `incomingValue`, `name` |
| `MISSING_PARAMETERS` | `assertOptions` missing paths; reading unset required fields | `parameters: string[]`, `friendlyMessages?` |
| `INVALID_PARAMETERS` | Bad inputs to utilities (`getFields`, duration parsing, …) | `parameters: string[]` |
| `UNEXPECTED_PARAMETERS` | Values for fields that don't exist | `parameters: string[]` |
| `FIELDS_NOT_MAPPED` | `KeyMapper` hit keys not in its map | `fields: string[]` |
| `INVALID_FIELD_REGISTRATION` | `registerFieldType` given a bad registration | `package`, `className`, `type`, `importAs`, `description` |
| `INVALID_SCHEMA_REFERENCE` | Codegen: schema reference missing a namespace | (friendlyMessage) |
| `NOT_IMPLEMENTED` | Custom field missing `generateTemplateDetails()` | `instructions` (a copy/paste stub) |

Note the singular/plural split: `FieldError.code` values are singular (`MISSING_PARAMETER`) and live *inside* a `VALIDATION_FAILED`; the plural codes are top-level aggregate errors. `mapFieldErrorsToParameterErrors()` bridges from the first to the second.

```ts
import { SchemaError } from '@sprucelabs/schema'

try {
    validateSchemaValues(personSchema, values)
} catch (err) {
    if (err instanceof SchemaError && err.options.code === 'VALIDATION_FAILED') {
        console.log(err.message) // friendly numbered list
        console.log(err.options.errors) // FieldError tree
    }
}
```

---

## Utilities

### `assertOptions(options, paths, friendlyMessage?)`

The guard-clause utility used all over the Spruce platform. Checks that each path (dot notation supported, depth 3) is not `null`/`undefined` — falsy-but-present values like `0` and `''` pass. Throws one `MISSING_PARAMETERS` listing everything missing, and **returns `options` with the checked paths narrowed to `NonNullable`**:

```ts
import { assertOptions } from '@sprucelabs/schema'

const { organizationId } = assertOptions(options, ['organizationId', 'nested.hey'])
organizationId // string — narrowed from string | null | undefined
```

### `KeyMapper`

Rename keys between two shapes (e.g. your schema ↔ a third-party API):

```ts
import { KeyMapper } from '@sprucelabs/schema'

const mapper = new KeyMapper({ firstName: 'given_name', lastName: 'family_name' })

mapper.mapTo({ firstName: 'Tay' }) // { given_name: 'Tay' }
mapper.mapFrom({ given_name: 'Tay' }) // { firstName: 'Tay' }
mapper.mapFieldNameTo('firstName') // 'given_name'
mapper.mapFieldNameFrom('family_name') // 'lastName'

mapper.mapTo({ nickname: 'T' }) // throws FIELDS_NOT_MAPPED { fields: ['nickname'] }
mapper.mapTo({ nickname: 'T' }, { shouldThrowOnUnmapped: false }) // {} — drops silently
```

### Cloning

```ts
import { cloneDeep, cloneDeepPreservingInstances } from '@sprucelabs/schema'

cloneDeep(value) // deep clone: objects, arrays, Map, Set, Date, RegExp
cloneDeepPreservingInstances(value) // same, but class instances pass by reference
```

Entities use `cloneDeepPreservingInstances` internally, so nested entity instances survive construction intact.

### Phone numbers

```ts
import { formatPhoneNumber, isValidNumber, isDummyNumber } from '@sprucelabs/schema'

formatPhoneNumber('5555555555') // '+1 555-555-5555' (default country +1)
formatPhoneNumber('+49 170 1234567') // '+49 170 123 4567' (also +92, +90 built in)
formatPhoneNumber('nope') // 'nope' — fails silently by default
formatPhoneNumber('nope', false) // throws Error('INVALID_PHONE_NUMBER')

isValidNumber('555-555-5555') // true
isDummyNumber('+1 555-555-5555') // true — 555/1555 numbers, handy in tests
```

### Select choices

```ts
import { selectChoicesToHash, schemaChoicesToHash } from '@sprucelabs/schema'

selectChoicesToHash([{ value: 'sm', label: 'Small' }]) // { sm: 'Small' }
schemaChoicesToHash(shirtSchema, 'size') // reads choices off a select field, fully typed
```

---

## Testing helpers

Ships with assertion helpers (via the runtime dependency `@sprucelabs/test-utils`):

### `validationErrorAssert`

Asserts *which fields* inside a `VALIDATION_FAILED` were missing/invalid/unexpected — dot notation reaches into nested schemas:

```ts
import { validationErrorAssert } from '@sprucelabs/schema'
import { assert } from '@sprucelabs/test-utils'

const err = assert.doesThrow(() => validateSchemaValues(personSchema, {}))

validationErrorAssert.assertError(err, {
    missing: ['firstName', 'requiredCar.name'],
    invalid: ['age'],
    unexpected: ['whoops'],
})
```

Pair it with `errorAssert` from `@sprucelabs/test-utils` for the outer error code:

```ts
errorAssert.assertError(err, 'VALIDATION_FAILED')
errorAssert.assertError(err, 'MISSING_PARAMETERS', { parameters: ['organizationId'] })
```

### `selectAssert`

```ts
import { selectAssert } from '@sprucelabs/schema'

selectAssert.assertSelectChoicesMatch(field.options.choices, ['draft', 'live'])
// order-insensitive, compares values only
```

(`selectAssertUtil` is a deprecated alias.)

### `AbstractSchemaTest`

A test base class that resets the schema registry before each test (avoiding `DUPLICATE_SCHEMA` bleed) and exposes `this.registry`. Note it isn't exported from the package root — extend the same two-line pattern in your own base class:

```ts
protected static async beforeEach() {
    await super.beforeEach()
    SchemaRegistry.getInstance().forgetAllSchemas()
}
```

---

## Custom field types

Fields are pluggable. Subclass `AbstractField`, describe yourself, and register:

```ts
import { AbstractField, FieldDefinition, registerFieldType } from '@sprucelabs/schema'

type ColorFieldDefinition = FieldDefinition<string> & {
    type: 'color'
    options?: { allowAlpha?: boolean }
}

class ColorField extends AbstractField<ColorFieldDefinition> {
    public static readonly description = 'A CSS color value.'

    public static generateTemplateDetails() {
        return { valueType: 'string' }
    }

    public validate(value: any) {
        const errors = super.validate(value) // required check
        if (value && !isValidCssColor(value)) {
            errors.push({
                code: 'INVALID_PARAMETER',
                name: this.name,
                friendlyMessage: `'${value}' is not a valid color!`,
            })
        }
        return errors
    }

    public toValueType(value: any) {
        return `${value}`.toLowerCase()
    }
}

export default registerFieldType({
    type: 'Color', // PascalCase — becomes the enum key in generated code
    class: ColorField,
    package: '@my-org/my-fields',
    importAs: 'MyFields',
})
```

- `static description` is required (the base class ships a nag message if you forget).
- `static generateTemplateDetails()` tells codegen what type to render; forget it and you get a helpful `NOT_IMPLEMENTED` error containing a copy/paste stub.
- `static generateTypeDetails()` (optional) supplies a `valueTypeMapper` for advanced generic types — see `SelectField`/`SchemaField` for the pattern.
- Note the case split: the addon/registration `type` is PascalCase (`'DateTime'`), while the `type` string used in field definitions is camelCase (`'dateTime'`).

All 16 built-in registrations are exported as `fieldRegistrations: FieldRegistration[]` — that array is what the Spruce CLI consumes to generate field enums and class maps in consuming projects.

---

## Code generation

The library carries everything needed to render schemas into source code:

- **`SchemaTypesRenderer`** — renders a schema into a Go struct (one struct per call; nested schemas need their own calls):

```ts
import { SchemaTypesRenderer } from '@sprucelabs/schema'

SchemaTypesRenderer.Renderer().render(schema, {
    language: 'go',
    schemaTemplateItems: [],
})
// type Person struct {
//     FirstName string `json:"firstName" validate:"required"`
//     Age float64 `json:"age,omitempty"`
// }
```

Required fields get `validate:"required"` tags, arrays get `min=`/`dive`, `hint`s become comments, and optional fields get `,omitempty`.

- **Template types** — `TemplateRenderAs` (enum: `Type` / `Value` / `SchemaType`), `SchemaTemplateItem`, `FieldTemplateItem`, `FieldTemplateDetails`, `TemplateLanguage` (`'ts' | 'go'`) are all exported for tooling that renders TypeScript types (the Spruce CLI uses these plus each field's `generateTemplateDetails()`).
- Schema-level codegen hints: `importsWhenLocal`, `importsWhenRemote`, `moduleToImportFromWhenRemote`, `typeSuffix` (e.g. `'<T>'` for generic passthrough).

---

## Gotchas & good-to-knows

1. **Required array fields default to `minArrayLength: 1`** — `[]` fails. Set `minArrayLength: 0` to allow empties.
2. **`get`/`getValues` validate by default** — reading an entity with unset required fields throws. Use `{ shouldValidate: false }` for partial reads.
3. **`shouldCreateEntityInstances` defaults differ by entry point**: `true` on entities (`get`/`getValues`), `false` in `normalizeSchemaValues`/`defaultSchemaValues`. The return *types* change with it.
4. **`DUPLICATE_SCHEMA` in tests** almost always means module-scope `buildSchema()` calls being re-imported — reset the registry in `beforeEach` (or set `SHOULD_USE_SCHEMA_REGISTRY=false`).
5. **`getSchema(id)` with no version throws `VERSION_NOT_FOUND`** when only versioned entries exist — version matching is exact.
6. **`setValues` can't clear a field with `undefined`** (it's skipped) — pass `null`. On dynamic entities, `setValues` is a shallow merge that skips normalization entirely (normalization happens on `get`).
7. **Setting an array on a non-array field keeps only element `[0]`** silently.
8. **`value` vs `defaultValue`**: `value` is applied at construction; `defaultValue` only surfaces through the default-values APIs.
9. **Union schema-field values use `id`**, i.e. `{ id: 'car', values: {...} }` (add `version` to disambiguate).
10. **Dynamic entities only know keys that have values** — an empty dynamic entity validates clean even with `isRequired: true` on the signature.
11. **`areSchemasTheSame` compares id + field names only** — not versions, namespaces, or field definitions.
12. **Not exported from the package root**: `DynamicSchemaEntityImplementation` (use `SchemaEntityFactory`), `AbstractEntity`, `AbstractSchemaTest`, `normalizePartialSchemaValues`. The `exports` map only exposes `"."`, so deep imports aren't available under modern module resolution.
13. **Declared-but-not-enforced options** (documented for codegen, no runtime check yet): `text.minLength`, `number.min`/`max` (enforced in generated Go via validate tags), `duration.minDuration`/`maxDuration`.
14. **`entity.namespace` and `entity.description` are currently unreliable** (they return `name` and `id` respectively) — read `schema.namespace`/`schema.description` off the schema itself.
15. **`SchemaValidateOptions.shouldMapToParameterErrors` is currently a no-op** — call `mapFieldErrorsToParameterErrors()` yourself.

---

## Contributing / local development

```bash
yarn                 # install
yarn build.dev       # compile to build/ (tests run against build/, not src/!)
yarn test            # jest — remember to build first
yarn watch.build.dev # recompile on change
yarn lint            # eslint
yarn lint.tsc        # type-check without emitting
```

- **Tests execute compiled JS in `build/`** (`testMatch: **/__tests__/**/*.test.js`) — if a test change doesn't seem to take effect, you forgot to rebuild (or aren't running the watcher).
- `#spruce/*` imports map to `build/.spruce/*` (generated field maps/types).
- `yarn build.dist` produces the dual CJS (`build/`) + ESM (`build/esm/`) publish layout.
- Releases go out via `semantic-release` (`release.config.cjs`).
- The behavioral test suite (`src/__tests__/behavioral/`) doubles as living documentation — nearly every feature above has a matching test file.

### Dependencies

[Arkit diagram here](docs/dependencies.md).
