export default class FieldValidationError extends Error {
	public errorMessages: string[]
	public fieldName: string

	public constructor(fieldName: string, errors: string[]) {
		super(`${fieldName}: ${errors.join(', ')}`)
		this.errorMessages = errors
		this.fieldName = fieldName
	}

	public friendlyReason() {
		return `${this.fieldName}: ${this.errorMessages.join(', ')}`
	}
}
