import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { ImageFieldDefinition, requiredImageSizes } from './ImageField.types'

export default class ImageField extends AbstractField<ImageFieldDefinition> {
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<ImageFieldDefinition>
	): FieldTemplateDetails {
		const { definition, importAs } = options
		return {
			valueType: `${importAs}.ImageFieldValue${definition.isArray ? '[]' : ''}`,
		}
	}

	public static get description() {
		return 'Images of various sizes!'
	}

	public validate(value: any) {
		const errors = super.validate(value)

		if (value && errors.length === 0 && !value.base64) {
			let sizes = this.getRequiredSizes()

			const missing: string[] = []

			for (const size of sizes) {
				const key = `${size}Uri`
				//@ts-ignore
				if (value && !value[key as any]) {
					missing.push(key)
				}
			}

			if (missing.length > 0) {
				errors.push({
					code: 'INVALID_PARAMETER',
					name: this.name,
					friendlyMessage: `You need to supply the remaining sizes to upload an image to ${
						this.label ?? this.name
					}: '${missing.join("', '")}'`,
				})
			}
		}

		return errors
	}

	private getRequiredSizes() {
		let sizes = this.definition.options?.requiredSizes ?? []
		if (sizes[0] === '*') {
			sizes = requiredImageSizes.filter((s) => s !== '*')
		}
		return sizes
	}
}
