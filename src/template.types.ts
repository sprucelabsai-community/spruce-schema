import { ISchemaDefinition } from './Schema'
import { FieldDefinition } from '#spruce:schema/fields/fields.types'

export interface IFieldTemplateDetails {
	/** The type of value (string, number) */
	valueType: string
}

/** How are we being rendered in the template */
export enum TemplateRenderAs {
	/** We are rendering type information (the value interface) */
	Type = 'type',
	/** We are rendering as a value (only called if a value is set in the schema definition) */
	Value = 'value',
	/** We are rendering as the definition's type (IDefinition) */
	DefinitionType = 'definitionType'
}

/** The shape of options passed to AbstractField.templateDetails(options) */
export interface IFieldTemplateDetailOptions<T extends any = any> {
	/** The language we're generating too, only TS for now */
	language: 'ts'
	/** All other schemas schemas being rendered */
	templateItems: ISchemaTemplateItem[]
	/** The global namespace to access items (only SpruceSchemas supported for now) */
	globalNamespace: 'SpruceSchemas'
	/** The options for this field */
	definition: T
	/** How we are being rendered */
	renderAs: TemplateRenderAs
	/** How our field library is being imported (specified in the registerFieldType addon) */
	importAs: string
}

// TODO THE NEXT INTERFACES MAY NOT BELONG HERE
/** The different names that a schema needs to generate all it's templates */
export interface ISchemaTemplateNames {
	/** A name in the form of FullName */
	pascalName: string
	/** A name in the form of fullName */
	camelName: string
	/** A name in the form of Full name */
	readableName: string
}

/** A schema about to be rendered into a template  (all schemas are in this shape before rendering) */
export interface ISchemaTemplateItem extends ISchemaTemplateNames {
	/** The namespace that owns this schema */
	namespace: string
	/** The schema's id pull out of definition for easy access */
	id: string
	/** The full schema's definition */
	definition: ISchemaDefinition
}

/** How a field is represented in the template */
export interface IFieldTemplateItem extends ISchemaTemplateNames {
	/** The name of the field class */
	className: string
	/** There package where the field definition lives */
	package: string
	/** How this field is being imported into schemas.types.ts */
	importAs: string
	/** The key for the FieldType enum */
	pascalType: string
	/** The value used for the FieldType enum */
	camelType: string
	/** Is this field type introduced by the skill be worked on right meow */
	isLocal: boolean
	/** The description associated with the field */
	description: string
	/** The definition this item was generated from */
	definition: FieldDefinition
}
