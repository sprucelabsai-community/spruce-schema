// THIS FILE IS REPLACED BY A GENERATED FILE USING PATH ALIASING AND SHOULD ALWAYS BE IMPORTED AS 'spruce:schema/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractField from './AbstractField'
import { IAddressFieldDefinition } from './AddressField'
import { IBooleanFieldDefinition } from './BooleanField'
import { IDateFieldDefinition } from './DateField'
import { IDateTimeFieldDefinition } from './DateTimeField'
import { IDirectoryFieldDefinition } from './DirectoryField'
import { IDurationFieldDefinition } from './DurationField'
import { IFileFieldDefinition } from './FileField'
import { IIdFieldDefinition } from './IdField'
import { INumberFieldDefinition } from './NumberField'
import { IPhoneFieldDefinition } from './PhoneField'
import { IRawFieldDefinition } from './RawField'
import { ISchemaFieldDefinition } from './SchemaField'
import { ISelectFieldDefinition } from './SelectField'
import { ITextFieldDefinition } from './TextField'

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
	| AbstractField<IBooleanFieldDefinition>
	| AbstractField<ISelectFieldDefinition>
	| AbstractField<IDurationFieldDefinition>
	| AbstractField<IIdFieldDefinition>
	| AbstractField<ITextFieldDefinition>
	| AbstractField<IAddressFieldDefinition>
	| AbstractField<IPhoneFieldDefinition>
	| AbstractField<ISchemaFieldDefinition>
	| AbstractField<IRawFieldDefinition>
	| AbstractField<INumberFieldDefinition>
	| AbstractField<IDateTimeFieldDefinition>
	| AbstractField<IFileFieldDefinition>
	| AbstractField<IDateFieldDefinition>
	| AbstractField<IDirectoryFieldDefinition>

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
	[FieldType.Boolean]: AbstractField<IBooleanFieldDefinition>
	[FieldType.Select]: AbstractField<ISelectFieldDefinition>
	[FieldType.Duration]: AbstractField<IDurationFieldDefinition>
	[FieldType.Id]: AbstractField<IIdFieldDefinition>
	[FieldType.Text]: AbstractField<ITextFieldDefinition>
	[FieldType.Address]: AbstractField<IAddressFieldDefinition>
	[FieldType.Phone]: AbstractField<IPhoneFieldDefinition>
	[FieldType.Schema]: AbstractField<ISchemaFieldDefinition>
	[FieldType.Raw]: AbstractField<IRawFieldDefinition>
	[FieldType.Number]: AbstractField<INumberFieldDefinition>
	[FieldType.DateTime]: AbstractField<IDateTimeFieldDefinition>
	[FieldType.File]: AbstractField<IFileFieldDefinition>
	[FieldType.Date]: AbstractField<IDateFieldDefinition>
	[FieldType.Directory]: AbstractField<IDirectoryFieldDefinition>
}
