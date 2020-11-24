import { IAddressFieldDefinition } from '../../../fields/AddressField.types'
import { IBooleanFieldDefinition } from '../../../fields/BooleanField.types'
import { IDateFieldDefinition } from '../../../fields/DateField.types'
import { IDateTimeFieldDefinition } from '../../../fields/DateTimeField.types'
import { IDirectoryFieldDefinition } from '../../../fields/DirectoryField.types'
import { IDurationFieldDefinition } from '../../../fields/DurationField.types'
import { IField } from '../../../fields/field.static.types'
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
	| IAddressFieldDefinition
	| IPhoneFieldDefinition
	| ISchemaFieldDefinition
	| IRawFieldDefinition
	| INumberFieldDefinition
	| IDateTimeFieldDefinition
	| IFileFieldDefinition
	| IDateFieldDefinition
	| IDirectoryFieldDefinition

export type Field =
	| IField<IBooleanFieldDefinition>
	| IField<ISelectFieldDefinition>
	| IField<IDurationFieldDefinition>
	| IField<IIdFieldDefinition>
	| IField<ITextFieldDefinition>
	| IField<IAddressFieldDefinition>
	| IField<IPhoneFieldDefinition>
	| IField<ISchemaFieldDefinition>
	| IField<IRawFieldDefinition>
	| IField<INumberFieldDefinition>
	| IField<IDateTimeFieldDefinition>
	| IField<IFileFieldDefinition>
	| IField<IDateFieldDefinition>
	| IField<IDirectoryFieldDefinition>

export interface FieldDefinitionMap {
	['boolean']: IBooleanFieldDefinition
	['select']: ISelectFieldDefinition
	['duration']: IDurationFieldDefinition
	['id']: IIdFieldDefinition
	['text']: ITextFieldDefinition
	['address']: IAddressFieldDefinition
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
	['address']: IAddressFieldDefinition['value']
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
	['boolean']: IField<IBooleanFieldDefinition>
	['select']: IField<ISelectFieldDefinition>
	['duration']: IField<IDurationFieldDefinition>
	['id']: IField<IIdFieldDefinition>
	['text']: IField<ITextFieldDefinition>
	['address']: IField<IAddressFieldDefinition>
	['phone']: IField<IPhoneFieldDefinition>
	['schema']: IField<ISchemaFieldDefinition>
	['raw']: IField<IRawFieldDefinition>
	['number']: IField<INumberFieldDefinition>
	['dateTime']: IField<IDateTimeFieldDefinition>
	['file']: IField<IFileFieldDefinition>
	['date']: IField<IDateFieldDefinition>
	['directory']: IField<IDirectoryFieldDefinition>
}
