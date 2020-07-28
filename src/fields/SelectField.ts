import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import {
	ISelectFieldDefinition,
	ISelectFieldDefinitionChoice,
} from './SelectField.types'

export default class SelectField<
	T extends ISelectFieldDefinition = ISelectFieldDefinition
> extends AbstractField<T> {
	public static get description() {
		return 'Stored as string, lets user select between available options.'
	}

	public static get valueTypeGeneratorType() {
		return 'SelectValueTypeGenerator<F extends ISelectFieldDefinition ? F: ISelectFieldDefinition>'
	}

	public constructor(name: string, definition: T) {
		super(name, definition)
		if (!definition.options || !definition.options.choices) {
			throw new Error('Select field is missing choices.')
		}
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<ISelectFieldDefinition>
	) {
		// Build union of select options
		const { definition } = options
		const {
			options: { choices },
		} = definition

		return {
			valueTypeGenerator: 'SelectValueTypeGenerator',
			valueType: `(${choices
				.map((choice) => `"${choice.value}"`)
				.join(' | ')})`,
		}
	}

	public getChoices(): ISelectFieldDefinitionChoice[] {
		return this.definition.options.choices
	}
}
