// This is the only file that depends on concrete implementation. It is used by the FieldFactory to instantiate new fields

import FieldType from './fieldTypeEnum'
import AddressField from '../../../fields/AddressField'
import BooleanField from '../../../fields/BooleanField'
import DateField from '../../../fields/DateField'
import DateTimeField from '../../../fields/DateTimeField'
import DirectoryField from '../../../fields/DirectoryField'
import DurationField from '../../../fields/DurationField'
import FileField from '../../../fields/FileField'
import IdField from '../../../fields/IdField'
import NumberField from '../../../fields/NumberField'
import PhoneField from '../../../fields/PhoneField'
import RawField from '../../../fields/RawField'
import SchemaField from '../../../fields/SchemaField'
import SelectField from '../../../fields/SelectField'
import TextField from '../../../fields/TextField'

/** A global place to reference all field type classes */
export const FieldClassMap = {
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
	[FieldType.File]: FileField,
	[FieldType.Date]: DateField,
	[FieldType.Directory]: DirectoryField
} as const
