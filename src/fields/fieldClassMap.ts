import FieldType from '#spruce:schema/fields/fieldType'
import { FieldClass } from '#spruce:schema/fields/fields.types'
import BooleanField from './BooleanField'
import SelectField from './SelectField'
import DurationField from './DurationField'
import IdField from './IdField'
import AddressField from './AddressField'
import PhoneField from './PhoneField'
import SchemaField from './SchemaField'
import RawField from './RawField'
import NumberField from './NumberField'
import DateTimeField from './DateTimeField'
import TextField from './TextField'
import FileField from './FileField'
import DateField from './DateField'
import DirectoryField from './DirectoryField'

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
