import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export interface IDirectoryFieldValue {
	path: string
}

export type IDirectoryFieldDefinition = IFieldDefinition<
	IDirectoryFieldValue
> & {
	/** * .Directory - select whole directories all at once */
	type: FieldType.Directory
	options?: {
		/** Will give you a path relative to this one, if possible */
		relativeTo?: string
	}
}
