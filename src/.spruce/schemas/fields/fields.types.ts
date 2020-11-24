import { AddressFieldDefinition } from '../../../fields/AddressField.types'
import { BooleanFieldDefinition } from '../../../fields/BooleanField.types'
import { DateFieldDefinition } from '../../../fields/DateField.types'
import { DateTimeFieldDefinition } from '../../../fields/DateTimeField.types'
import { DirectoryFieldDefinition } from '../../../fields/DirectoryField.types'
import { DurationFieldDefinition } from '../../../fields/DurationField.types'
import { Field } from '../../../fields/field.static.types'
import { FileFieldDefinition } from '../../../fields/FileField.types'
import { IdFieldDefinition } from '../../../fields/IdField.types'
import { NumberFieldDefinition } from '../../../fields/NumberField.types'
import { PhoneFieldDefinition } from '../../../fields/PhoneField.types'
import { RawFieldDefinition } from '../../../fields/RawField.types'
import {
	ISchemaFieldDefinition,
	SchemaFieldValueTypeMapper,
} from '../../../fields/SchemaField.types'
import {
	ISelectFieldDefinition,
	SelectFieldValueTypeMapper,
} from '../../../fields/SelectField.types'
import { ITextFieldDefinition } from '../../../fields/TextField.types'

export type FieldDefinitions =
	| BooleanFieldDefinition
	| ISelectFieldDefinition
	| DurationFieldDefinition
	| IdFieldDefinition
	| ITextFieldDefinition
	| AddressFieldDefinition
	| PhoneFieldDefinition
	| ISchemaFieldDefinition
	| RawFieldDefinition
	| NumberFieldDefinition
	| DateTimeFieldDefinition
	| FileFieldDefinition
	| DateFieldDefinition
	| DirectoryFieldDefinition

export type Fields =
	| Field<BooleanFieldDefinition>
	| Field<ISelectFieldDefinition>
	| Field<DurationFieldDefinition>
	| Field<IdFieldDefinition>
	| Field<ITextFieldDefinition>
	| Field<AddressFieldDefinition>
	| Field<PhoneFieldDefinition>
	| Field<ISchemaFieldDefinition>
	| Field<RawFieldDefinition>
	| Field<NumberFieldDefinition>
	| Field<DateTimeFieldDefinition>
	| Field<FileFieldDefinition>
	| Field<DateFieldDefinition>
	| Field<DirectoryFieldDefinition>

export interface FieldDefinitionMap {
	['boolean']: BooleanFieldDefinition
	['select']: ISelectFieldDefinition
	['duration']: DurationFieldDefinition
	['id']: IdFieldDefinition
	['text']: ITextFieldDefinition
	['address']: AddressFieldDefinition
	['phone']: PhoneFieldDefinition
	['schema']: ISchemaFieldDefinition
	['raw']: RawFieldDefinition
	['number']: NumberFieldDefinition
	['dateTime']: DateTimeFieldDefinition
	['file']: FileFieldDefinition
	['date']: DateFieldDefinition
	['directory']: DirectoryFieldDefinition
}

export interface FieldValueTypeGeneratorMap<
	F extends FieldDefinitions,
	CreateEntityInstances extends boolean
> {
	['boolean']: BooleanFieldDefinition['value']
	['select']: SelectFieldValueTypeMapper<
		F extends ISelectFieldDefinition ? F : ISelectFieldDefinition
	>
	['duration']: DurationFieldDefinition['value']
	['id']: IdFieldDefinition['value']
	['text']: ITextFieldDefinition['value']
	['address']: AddressFieldDefinition['value']
	['phone']: PhoneFieldDefinition['value']
	['schema']: SchemaFieldValueTypeMapper<
		F extends ISchemaFieldDefinition ? F : ISchemaFieldDefinition,
		CreateEntityInstances
	>
	['raw']: RawFieldDefinition['value']
	['number']: NumberFieldDefinition['value']
	['dateTime']: DateTimeFieldDefinition['value']
	['file']: FileFieldDefinition['value']
	['date']: DateFieldDefinition['value']
	['directory']: DirectoryFieldDefinition['value']
}

export interface FieldMap {
	['boolean']: Field<BooleanFieldDefinition>
	['select']: Field<ISelectFieldDefinition>
	['duration']: Field<DurationFieldDefinition>
	['id']: Field<IdFieldDefinition>
	['text']: Field<ITextFieldDefinition>
	['address']: Field<AddressFieldDefinition>
	['phone']: Field<PhoneFieldDefinition>
	['schema']: Field<ISchemaFieldDefinition>
	['raw']: Field<RawFieldDefinition>
	['number']: Field<NumberFieldDefinition>
	['dateTime']: Field<DateTimeFieldDefinition>
	['file']: Field<FileFieldDefinition>
	['date']: Field<DateFieldDefinition>
	['directory']: Field<DirectoryFieldDefinition>
}
