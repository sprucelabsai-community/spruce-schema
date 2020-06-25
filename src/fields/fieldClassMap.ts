import AddressField from './AddressField'
import BooleanField from './BooleanField'
import DateField from './DateField'
import DateTimeField from './DateTimeField'
import DirectoryField from './DirectoryField'
import DurationField from './DurationField'
import FileField from './FileField'
import IdField from './IdField'
import NumberField from './NumberField'
import PhoneField from './PhoneField'
import RawField from './RawField'
import SchemaField from './SchemaField'
import SelectField from './SelectField'
import TextField from './TextField'
import { FieldClass } from '#spruce:schema/fields/fields.types'
import FieldType from '#spruce:schema/fields/fieldType'

/** A global place to reference all field type classes */
export const FieldClassMap: Record<FieldType, FieldClass> = {
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
}
