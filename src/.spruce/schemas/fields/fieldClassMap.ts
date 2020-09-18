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

const fieldClassMap = {
	['boolean']: BooleanField,
	['select']: SelectField,
	['duration']: DurationField,
	['id']: IdField,
	['address']: AddressField,
	['phone']: PhoneField,
	['schema']: SchemaField,
	['raw']: RawField,
	['number']: NumberField,
	['dateTime']: DateTimeField,
	['text']: TextField,
	['file']: FileField,
	['date']: DateField,
	['directory']: DirectoryField,
} as const

export default fieldClassMap
