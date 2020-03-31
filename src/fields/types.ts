import FieldBoolean, { IFieldBooleanDefinition } from './Boolean'
import FieldSelect, { IFieldSelectDefinition } from './Select'
import FieldDuration, { IFieldDurationDefinition } from './Duration'
import FieldId, { IFieldIdDefinition } from './Id'
import FieldAddress, { IFieldAddressDefinition } from './Address'
import FieldPhone, { IFieldPhoneDefinition } from './Phone'
import FieldSchema, { IFieldSchemaDefinition } from './Schema'
import FieldRaw, { IFieldRawDefinition } from './Raw'
import FieldNumber, { IFieldNumberDefinition } from './Number'
import FieldDateTime, { IFieldDateTimeDefinition } from './DateTime'
import FieldText, { IFieldTextDefinition } from './Text'

export type IFieldDefinition =
	| IFieldBooleanDefinition
	| IFieldSelectDefinition
	| IFieldDurationDefinition
	| IFieldIdDefinition
	| IFieldTextDefinition
	| IFieldAddressDefinition
	| IFieldPhoneDefinition
	| IFieldSchemaDefinition
	| IFieldRawDefinition
	| IFieldNumberDefinition
	| IFieldDateTimeDefinition

export type FieldClass =
	| typeof FieldBoolean
	| typeof FieldSelect
	| typeof FieldDuration
	| typeof FieldId
	| typeof FieldText
	| typeof FieldAddress
	| typeof FieldPhone
	| typeof FieldSchema
	| typeof FieldRaw
	| typeof FieldNumber
	| typeof FieldDateTime

export type Field =
	| FieldBoolean
	| FieldSelect
	| FieldDuration
	| FieldId
	| FieldText
	| FieldAddress
	| FieldPhone
	| FieldSchema
	| FieldRaw
	| FieldNumber
	| FieldDateTime

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
	Raw = 'raw'
}

/** Useful for type lookups for generics */
export type FieldDefinitionMap = {
	[FieldType.Boolean]: IFieldBooleanDefinition
	[FieldType.Select]: IFieldSelectDefinition
	[FieldType.Duration]: IFieldDurationDefinition
	[FieldType.Id]: IFieldIdDefinition
	[FieldType.Text]: IFieldTextDefinition
	[FieldType.Address]: IFieldAddressDefinition
	[FieldType.Phone]: IFieldPhoneDefinition
	[FieldType.Schema]: IFieldSchemaDefinition
	[FieldType.Raw]: IFieldRawDefinition
	[FieldType.Number]: IFieldNumberDefinition
	[FieldType.DateTime]: IFieldDateTimeDefinition
}

export interface IFieldMap {
	[FieldType.Boolean]: FieldBoolean
	[FieldType.Select]: FieldSelect
	[FieldType.Duration]: FieldDuration
	[FieldType.Id]: FieldId
	[FieldType.Address]: FieldAddress
	[FieldType.Phone]: FieldPhone
	[FieldType.Schema]: FieldSchema
	[FieldType.Raw]: FieldRaw
	[FieldType.Number]: FieldNumber
	[FieldType.DateTime]: FieldDateTime
	[FieldType.Text]: FieldText
}

/** A global place to reference all field type classes */
export const FieldClassMap: Record<FieldType, FieldClass> = {
	[FieldType.Boolean]: FieldBoolean,
	[FieldType.Select]: FieldSelect,
	[FieldType.Duration]: FieldDuration,
	[FieldType.Id]: FieldId,
	[FieldType.Address]: FieldAddress,
	[FieldType.Phone]: FieldPhone,
	[FieldType.Schema]: FieldSchema,
	[FieldType.Raw]: FieldRaw,
	[FieldType.Number]: FieldNumber,
	[FieldType.DateTime]: FieldDateTime,
	[FieldType.Text]: FieldText
}
