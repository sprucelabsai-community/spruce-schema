import { FieldDefinition } from './field.static.types'

/**
 * Min dimension for each size
	xl: 1024
	l: 500
	m: 60
	s: 30
*/

export const requiredImageSizes = ['s', 'm', 'l', 'xl', '*'] as const

export type RequiredImageSize = typeof requiredImageSizes[number]

export interface ImageFieldValue {
	name: string
	base64?: string
	sUri?: string
	mUri?: string
	lUri?: string
	xlUri?: string
}

export type ImageFieldDefinition = FieldDefinition<ImageFieldValue> & {
	/** * .image - a great way to deal with file management */
	type: 'image'
	options?: {
		requiredSizes: RequiredImageSize[]
	}
}
