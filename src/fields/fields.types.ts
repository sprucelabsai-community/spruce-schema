import { IAddressFieldDefinition } from './AddressField.types'
import { IBooleanFieldDefinition } from './BooleanField.types'
import { IDateFieldDefinition } from './DateField.types'
import { IDateTimeFieldDefinition } from './DateTimeField.types'
import { IDirectoryFieldDefinition } from './DirectoryField.types'
import { IDurationFieldDefinition } from './DurationField.types'
import { IField } from './field.static.types'
import { IFileFieldDefinition } from './FileField.types'
import { IIdFieldDefinition } from './IdField.types'
import { INumberFieldDefinition } from './NumberField.types'
import { IPhoneFieldDefinition } from './PhoneField.types'
import { IRawFieldDefinition } from './RawField.types'
import {
	ISchemaFieldDefinition,
	SchemaFieldValueTypeMapper,
} from './SchemaField.types'
import {
	ISelectFieldDefinition,
	SelectFieldValueTypeMapper,
} from './SelectField.types'
import { ITextFieldDefinition } from './TextField.types'

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

export interface IFieldDefinitionMap {
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

export interface IFieldValueTypeGeneratorMap<
	F extends FieldDefinition,
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

export interface IFieldMap {
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
