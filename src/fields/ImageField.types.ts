import { FieldDefinition } from './field.static.types'

export const requiredImageSizes = [
	'xxs',
	'xs',
	's',
	'm',
	'l',
	'xl',
	'xxl',
	'*',
] as const

export type RequiredImageSize = typeof requiredImageSizes[number]

export interface ImageFieldValue {
	name: string
	base64?: string
	xxsUri?: string
	xsUri?: string
	sUri?: string
	mUri?: string
	lUri?: string
	xlUri?: string
	xxlUri?: string
}

export type ImageFieldDefinition = FieldDefinition<ImageFieldValue> & {
	/** * .image - a great way to deal with file management */
	type: 'image'
	options?: {
		requiredSizes: RequiredImageSize[]
	}
}
