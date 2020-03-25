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
	/** a string, something like varchar(255), configure size using options to impact rendering and storage length */
	Text = 'text',
	/** a true/false, renders as a toggle or checkbox, or a Y/N if used in cli */
	Boolean = 'boolean',
	/** a multiple choice option, setting isArray to true will allow multiple selection */
	Select = 'select',
	/** a span of time, using in the form 1h or 30min */
	Duration = 'duration',
	/** a number, integer, float, etc */
	Number = 'number',
	/** an address input, anything google can resolve */
	Address = 'address',
	/** a phone number, international */
	Phone = 'phone',
	/** for storing a date, a time, or both */
	DateTime = 'dateTime',
	/** points to another schema */
	Schema = 'schema',
	/** unique id */
	Id = 'id',
	/** 🛑 Core API only */
	Raw = 'raw'
}

/** useful for type lookups for generics */
export type FieldDefinitionMap = {
	boolean: IFieldBooleanDefinition
	select: IFieldSelectDefinition
	duration: IFieldDurationDefinition
	id: IFieldIdDefinition
	text: IFieldTextDefinition
	address: IFieldAddressDefinition
	phone: IFieldPhoneDefinition
	schema: IFieldSchemaDefinition
	raw: IFieldRawDefinition
	number: IFieldNumberDefinition
	dateTime: IFieldDateTimeDefinition
}

/** a global place to reference all field type classes */
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
