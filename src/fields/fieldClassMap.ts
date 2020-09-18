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
