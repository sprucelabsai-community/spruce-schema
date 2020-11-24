import { AddressFieldDefinition } from '../../../fields/AddressField.types'
import { IBooleanFieldDefinition } from '../../../fields/BooleanField.types'
import { IDateFieldDefinition } from '../../../fields/DateField.types'
import { IDateTimeFieldDefinition } from '../../../fields/DateTimeField.types'
import { IDirectoryFieldDefinition } from '../../../fields/DirectoryField.types'
import { IDurationFieldDefinition } from '../../../fields/DurationField.types'
import { Field } from '../../../fields/field.static.types'
import { IFileFieldDefinition } from '../../../fields/FileField.types'
import { IIdFieldDefinition } from '../../../fields/IdField.types'
import { INumberFieldDefinition } from '../../../fields/NumberField.types'
import { IPhoneFieldDefinition } from '../../../fields/PhoneField.types'
import { IRawFieldDefinition } from '../../../fields/RawField.types'
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
	| IBooleanFieldDefinition
	| ISelectFieldDefinition
	| IDurationFieldDefinition
	| IIdFieldDefinition
	| ITextFieldDefinition
	| AddressFieldDefinition
	| IPhoneFieldDefinition
	| ISchemaFieldDefinition
	| IRawFieldDefinition
	| INumberFieldDefinition
	| IDateTimeFieldDefinition
	| IFileFieldDefinition
	| IDateFieldDefinition
	| IDirectoryFieldDefinition

export type Fields =
	| Field<IBooleanFieldDefinition>
	| Field<ISelectFieldDefinition>
	| Field<IDurationFieldDefinition>
	| Field<IIdFieldDefinition>
	| Field<ITextFieldDefinition>
	| Field<AddressFieldDefinition>
	| Field<IPhoneFieldDefinition>
	| Field<ISchemaFieldDefinition>
	| Field<IRawFieldDefinition>
	| Field<INumberFieldDefinition>
	| Field<IDateTimeFieldDefinition>
	| Field<IFileFieldDefinition>
	| Field<IDateFieldDefinition>
	| Field<IDirectoryFieldDefinition>

export interface FieldDefinitionMap {
	['boolean']: IBooleanFieldDefinition
	['select']: ISelectFieldDefinition
	['duration']: IDurationFieldDefinition
	['id']: IIdFieldDefinition
	['text']: ITextFieldDefinition
	['address']: AddressFieldDefinition
	['phone']: IPhoneFieldDefinition
	['schema']: ISchemaFieldDefinition
	['raw']: IRawFieldDefinition
	['number']: INumberFieldDefinition
	['dateTime']: IDateTimeFieldDefinition
	['file']: IFileFieldDefinition
	['date']: IDateFieldDefinition
	['directory']: IDirectoryFieldDefinition
}

export interface FieldValueTypeGeneratorMap<
	F extends FieldDefinitions,
	CreateEntityInstances extends boolean
> {
	['boolean']: IBooleanFieldDefinition['value']
	['select']: SelectFieldValueTypeMapper<
		F extends ISelectFieldDefinition ? F : ISelectFieldDefinition
	>
	['duration']: IDurationFieldDefinition['value']
	['id']: IIdFieldDefinition['value']
	['text']: ITextFieldDefinition['value']
	['address']: AddressFieldDefinition['value']
	['phone']: IPhoneFieldDefinition['value']
	['schema']: SchemaFieldValueTypeMapper<
		F extends ISchemaFieldDefinition ? F : ISchemaFieldDefinition,
		CreateEntityInstances
	>
	['raw']: IRawFieldDefinition['value']
	['number']: INumberFieldDefinition['value']
	['dateTime']: IDateTimeFieldDefinition['value']
	['file']: IFileFieldDefinition['value']
	['date']: IDateFieldDefinition['value']
	['directory']: IDirectoryFieldDefinition['value']
}

export interface FieldMap {
	['boolean']: Field<IBooleanFieldDefinition>
	['select']: Field<ISelectFieldDefinition>
	['duration']: Field<IDurationFieldDefinition>
	['id']: Field<IIdFieldDefinition>
	['text']: Field<ITextFieldDefinition>
	['address']: Field<AddressFieldDefinition>
	['phone']: Field<IPhoneFieldDefinition>
	['schema']: Field<ISchemaFieldDefinition>
	['raw']: Field<IRawFieldDefinition>
	['number']: Field<INumberFieldDefinition>
	['dateTime']: Field<IDateTimeFieldDefinition>
	['file']: Field<IFileFieldDefinition>
	['date']: Field<IDateFieldDefinition>
	['directory']: Field<IDirectoryFieldDefinition>
}
