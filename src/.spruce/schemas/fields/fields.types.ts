// This types file can only depend on types.
import FieldType from './fieldTypeEnum'
import { IField } from '../../../fields/field.static.types'
import { IFileFieldDefinition } from '../../../fields/FileField.types'
import { ISelectFieldDefinition } from '../../../fields/SelectField.types'
import { ITextFieldDefinition } from '../../../fields/TextField.types'
import { IAddressFieldDefinition } from '../../../fields/AddressField.types'
import { IBooleanFieldDefinition } from '../../../fields/BooleanField.types'
import { IDurationFieldDefinition } from '../../../fields/DurationField.types'
import { IDateTimeFieldDefinition } from '../../../fields/DateTimeField.types'
import { IDateFieldDefinition } from '../../../fields/DateField.types'
import { IDirectoryFieldDefinition } from '../../../fields/DirectoryField.types'
import { IIdFieldDefinition } from '../../../fields/IdField.types'
import { INumberFieldDefinition } from '../../../fields/NumberField.types'
import { IPhoneFieldDefinition } from '../../../fields/PhoneField.types'
import { ISchemaFieldDefinition } from '../../../fields/SchemaField.types'
import { IRawFieldDefinition } from '../../../fields/RawField.types'

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

export interface IFieldMap {
	[FieldType.Boolean]: IField<IBooleanFieldDefinition>
	[FieldType.Select]: IField<ISelectFieldDefinition>
	[FieldType.Duration]: IField<IDurationFieldDefinition>
	[FieldType.Id]: IField<IIdFieldDefinition>
	[FieldType.Text]: IField<ITextFieldDefinition>
	[FieldType.Address]: IField<IAddressFieldDefinition>
	[FieldType.Phone]: IField<IPhoneFieldDefinition>
	[FieldType.Schema]: IField<ISchemaFieldDefinition>
	[FieldType.Raw]: IField<IRawFieldDefinition>
	[FieldType.Number]: IField<INumberFieldDefinition>
	[FieldType.DateTime]: IField<IDateTimeFieldDefinition>
	[FieldType.File]: IField<IFileFieldDefinition>
	[FieldType.Date]: IField<IDateFieldDefinition>
	[FieldType.Directory]: IField<IDirectoryFieldDefinition>
}
