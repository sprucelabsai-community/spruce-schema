// THIS FILE IS REPLACED BY A GENERATED FILE USING PATH ALIASING AND SHOULD ALWAYS BE IMPORTED AS 'spruce:schema/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AddressField, { IAddressFieldDefinition } from './AddressField'
import BooleanField, { IBooleanFieldDefinition } from './BooleanField'
import DateField, { IDateFieldDefinition } from './DateField'
import DateTimeField, { IDateTimeFieldDefinition } from './DateTimeField'
import DirectoryField, { IDirectoryFieldDefinition } from './DirectoryField'
import DurationField, { IDurationFieldDefinition } from './DurationField'
import FileField, { IFileFieldDefinition } from './FileField'
import IdField, { IIdFieldDefinition } from './IdField'
import NumberField, { INumberFieldDefinition } from './NumberField'
import PhoneField, { IPhoneFieldDefinition } from './PhoneField'
import RawField, { IRawFieldDefinition } from './RawField'
import SchemaField, { ISchemaFieldDefinition } from './SchemaField'
import SelectField, { ISelectFieldDefinition } from './SelectField'
import TextField, { ITextFieldDefinition } from './TextField'

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
	| IDateFieldDefinition
	| IDirectoryFieldDefinition

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
	| typeof DateField
	| typeof DirectoryField

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
	| DateField
	| DirectoryField

/** Useful for type lookups for generics */
export interface IFieldDefinitionMap {
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
	[FieldType.Date]: IDateFieldDefinition
	[FieldType.Directory]: IDirectoryFieldDefinition
}

/** Used to lookup field classes by type */
export interface IFieldMap {
	[FieldType.Boolean]: BooleanField
	[FieldType.Select]: SelectField
	[FieldType.Duration]: DurationField
	[FieldType.Id]: IdField
	[FieldType.Text]: TextField
	[FieldType.Address]: AddressField
	[FieldType.Phone]: PhoneField
	[FieldType.Schema]: SchemaField
	[FieldType.Raw]: RawField
	[FieldType.Number]: NumberField
	[FieldType.DateTime]: DateTimeField
	[FieldType.File]: FileField
	[FieldType.Date]: DateField
	[FieldType.Directory]: DirectoryField
}
