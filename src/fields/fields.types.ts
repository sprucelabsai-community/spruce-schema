import { FieldType } from '#spruce:schema/fields/fieldType'
import BooleanField, { IBooleanFieldDefinition } from './BooleanField'
import SelectField, { ISelectFieldDefinition } from './SelectField'
import DurationField, { IDurationFieldDefinition } from './DurationField'
import IdField, { IIdFieldDefinition } from './IdField'
import AddressField, { IAddressFieldDefinition } from './AddressField'
import PhoneField, { IPhoneFieldDefinition } from './PhoneField'
import SchemaField, { ISchemaFieldDefinition } from './SchemaField'
import RawField, { IRawFieldDefinition } from './RawField'
import NumberField, { INumberFieldDefinition } from './NumberField'
import DateTimeField, { IDateTimeFieldDefinition } from './DateTimeField'
import TextField, { ITextFieldDefinition } from './TextField'
import FileField, { IFileFieldDefinition } from './FileField'

export type FieldDefinition =
	| IBooleanFieldDefinition
	| ISelectFieldDefinition
	| IDurationFieldDefinition
	| IIdFieldDefinition
	| ITextFieldDefinition
	| IAddressFieldDefinition
	| IPhoneFieldDefinition
	| ISchemaFieldDefinition
	| IRawFieldDefinition
	| INumberFieldDefinition
	| IDateTimeFieldDefinition
	| IFileFieldDefinition

export type FieldClass =
	| typeof BooleanField
	| typeof SelectField
	| typeof DurationField
	| typeof IdField
	| typeof TextField
	| typeof AddressField
	| typeof PhoneField
	| typeof SchemaField
	| typeof RawField
	| typeof NumberField
	| typeof DateTimeField
	| typeof FileField

export type Field =
	| BooleanField
	| SelectField
	| DurationField
	| IdField
	| TextField
	| AddressField
	| PhoneField
	| SchemaField
	| RawField
	| NumberField
	| DateTimeField
	| FileField

/** Useful for type lookups for generics */
export type FieldDefinitionMap = {
	[FieldType.Boolean]: IBooleanFieldDefinition
	[FieldType.Select]: ISelectFieldDefinition
	[FieldType.Duration]: IDurationFieldDefinition
	[FieldType.Id]: IIdFieldDefinition
	[FieldType.Text]: ITextFieldDefinition
	[FieldType.Address]: IAddressFieldDefinition
	[FieldType.Phone]: IPhoneFieldDefinition
	[FieldType.Schema]: ISchemaFieldDefinition
	[FieldType.Raw]: IRawFieldDefinition
	[FieldType.Number]: INumberFieldDefinition
	[FieldType.DateTime]: IDateTimeFieldDefinition
	[FieldType.File]: IFileFieldDefinition
}

/** A global place to reference all field type classes */
export const FieldClassMap: Record<FieldType, FieldClass> = {
	[FieldType.Boolean]: BooleanField,
	[FieldType.Select]: SelectField,
	[FieldType.Duration]: DurationField,
	[FieldType.Id]: IdField,
	[FieldType.Address]: AddressField,
	[FieldType.Phone]: PhoneField,
	[FieldType.Schema]: SchemaField,
	[FieldType.Raw]: RawField,
	[FieldType.Number]: NumberField,
	[FieldType.DateTime]: DateTimeField,
	[FieldType.Text]: TextField,
	[FieldType.File]: FileField
}

export interface IFieldClassMap {
	[FieldType.Boolean]: BooleanField
	[FieldType.Select]: SelectField
	[FieldType.Duration]: DurationField
	[FieldType.Id]: IdField
	[FieldType.Address]: AddressField
	[FieldType.Phone]: PhoneField
	[FieldType.Schema]: SchemaField
	[FieldType.Raw]: RawField
	[FieldType.Number]: NumberField
	[FieldType.DateTime]: DateTimeField
	[FieldType.Text]: TextField
	[FieldType.File]: FileField
}
