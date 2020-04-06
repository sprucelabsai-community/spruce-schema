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

export type IFieldDefinition =
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

export enum FieldType {
	/** A string, something like varchar(255), configure size using options to impact rendering and storage length */
	Text = 'text',
	/** A true/false, renders as a toggle or checkbox, or a Y/N if used in cli */
	Boolean = 'boolean',
	/** A multiple choice option, setting isArray to true will allow multiple selection */
	Select = 'select',
	/** A span of time, using in the form 1h or 30min */
	Duration = 'duration',
	/** A number, integer, float, etc */
	Number = 'number',
	/** An address input, anything google can resolve */
	Address = 'address',
	/** A phone number, international */
	Phone = 'phone',
	/** For storing a date, a time, or both */
	DateTime = 'dateTime',
	/** Points to another schema */
	Schema = 'schema',
	/** Unique id */
	Id = 'id',
	/** 🛑 Core API only */
	Raw = 'raw',
	/** File select */
	File = 'File'
}

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

export interface IFieldMap {
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
