enum FieldType {
	/** A string, something like varchar(255), configure size using options to impact rendering and storage length */
	Text = 'text',
	/** A true/false, renders as a toggle or checkbox, or a Y/N if used in cli */
	Boolean = 'boolean',
	/** A multiple choice option, setting isArray to true will allow multiple selection */
	Select = 'select',
	/** A span of time, using in the form 1h or 30min */
	Duration = 'duration',
	/** A number, integer, float, etc */
	Number = 'number',
	/** An address input, anything google can resolve */
	Address = 'address',
	/** A phone number, international */
	Phone = 'phone',
	/** For storing a date, a time, or both */
	DateTime = 'dateTime',
	/** Points to another schema */
	Schema = 'schema',
	/** Unique id */
	Id = 'id',
	/** 🛑 Core API only */
	Raw = 'raw',
	/** File select/upload */
	File = 'file',
	/** Directory selection */
	Directory = 'directory',
	/** A date object with time being ignored*/
	Date = 'date'
}

export default FieldType
