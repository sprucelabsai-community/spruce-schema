import { AddressFieldDefinition } from '../../../fields/AddressField.types'
import { BooleanFieldDefinition } from '../../../fields/BooleanField.types'
import { DateFieldDefinition } from '../../../fields/DateField.types'
import { DateTimeFieldDefinition } from '../../../fields/DateTimeField.types'
import { DirectoryFieldDefinition } from '../../../fields/DirectoryField.types'
import { DurationFieldDefinition } from '../../../fields/DurationField.types'
import { EmailFieldDefinition } from '../../../fields/EmailField.types'
import { Field } from '../../../fields/field.static.types'
import { FileFieldDefinition } from '../../../fields/FileField.types'
import { IdFieldDefinition } from '../../../fields/IdField.types'
import { NumberFieldDefinition } from '../../../fields/NumberField.types'
import { PhoneFieldDefinition } from '../../../fields/PhoneField.types'
import { RawFieldDefinition } from '../../../fields/RawField.types'
import {
	SchemaFieldFieldDefinition,
	SchemaFieldValueTypeMapper,
} from '../../../fields/SchemaField.types'
import {
	SelectFieldDefinition,
	SelectFieldValueTypeMapper,
} from '../../../fields/SelectField.types'
import { TextFieldDefinition } from '../../../fields/TextField.types'

export type FieldDefinitions =
	| BooleanFieldDefinition
	| SelectFieldDefinition
	| DurationFieldDefinition
	| IdFieldDefinition
	| TextFieldDefinition
	| AddressFieldDefinition
	| PhoneFieldDefinition
	| SchemaFieldFieldDefinition
	| RawFieldDefinition
	| NumberFieldDefinition
	| DateTimeFieldDefinition
	| FileFieldDefinition
	| DateFieldDefinition
	| DirectoryFieldDefinition 
	| EmailFieldDefinition

export type Fields =
	| Field<BooleanFieldDefinition>
	| Field<SelectFieldDefinition>
	| Field<DurationFieldDefinition>
	| Field<IdFieldDefinition>
	| Field<TextFieldDefinition>
	| Field<AddressFieldDefinition>
	| Field<PhoneFieldDefinition>
	| Field<SchemaFieldFieldDefinition>
	| Field<RawFieldDefinition>
	| Field<NumberFieldDefinition>
	| Field<DateTimeFieldDefinition>
	| Field<FileFieldDefinition>
	| Field<DateFieldDefinition>
	| Field<DirectoryFieldDefinition> 
	| Field<EmailFieldDefinition>

export interface FieldDefinitionMap {
	['boolean']: BooleanFieldDefinition
	['select']: SelectFieldDefinition
	['duration']: DurationFieldDefinition
	['id']: IdFieldDefinition
	['text']: TextFieldDefinition
	['address']: AddressFieldDefinition
	['phone']: PhoneFieldDefinition
	['schema']: SchemaFieldFieldDefinition
	['raw']: RawFieldDefinition
	['number']: NumberFieldDefinition
	['dateTime']: DateTimeFieldDefinition
	['file']: FileFieldDefinition
	['date']: DateFieldDefinition
	['directory']: DirectoryFieldDefinition
	['email']: EmailFieldDefinition
}

export interface FieldValueTypeGeneratorMap<
	F extends FieldDefinitions,
	CreateEntityInstances extends boolean
	> {
	['boolean']: BooleanFieldDefinition['value']
	['select']: SelectFieldValueTypeMapper<
		F extends SelectFieldDefinition ? F : SelectFieldDefinition
	>
	['duration']: DurationFieldDefinition['value']
	['id']: IdFieldDefinition['value']
	['text']: TextFieldDefinition['value']
	['address']: AddressFieldDefinition['value']
	['phone']: PhoneFieldDefinition['value']
	['schema']: SchemaFieldValueTypeMapper<
		F extends SchemaFieldFieldDefinition ? F : SchemaFieldFieldDefinition,
		CreateEntityInstances
	>
	['raw']: RawFieldDefinition['value']
	['number']: NumberFieldDefinition['value']
	['dateTime']: DateTimeFieldDefinition['value']
	['file']: FileFieldDefinition['value']
	['date']: DateFieldDefinition['value']
	['directory']: DirectoryFieldDefinition['value']
	['email']: EmailFieldDefinition['value']
}

export interface FieldMap {
	['boolean']: Field<BooleanFieldDefinition>
	['select']: Field<SelectFieldDefinition>
	['duration']: Field<DurationFieldDefinition>
	['id']: Field<IdFieldDefinition>
	['text']: Field<TextFieldDefinition>
	['address']: Field<AddressFieldDefinition>
	['phone']: Field<PhoneFieldDefinition>
	['schema']: Field<SchemaFieldFieldDefinition>
	['raw']: Field<RawFieldDefinition>
	['number']: Field<NumberFieldDefinition>
	['dateTime']: Field<DateTimeFieldDefinition>
	['file']: Field<FileFieldDefinition>
	['date']: Field<DateFieldDefinition>
	['directory']: Field<DirectoryFieldDefinition>
	['email']: Field<EmailFieldDefinition>
}
