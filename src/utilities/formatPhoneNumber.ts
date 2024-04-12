function formatNumberWithCode(phoneNumberString: string, code = '1') {
	if (phoneNumberString.match(/[a-zA-Z]/g)) {
		return null
	}

	const cleaned = ('' + phoneNumberString).replace(/\D/g, '')

	// Dynamically insert the country code into the regex
	let regexPattern = new RegExp(`^(${code})?(\\d{3})(\\d{0,3})(\\d{0,4})$`)
	let match = cleaned.match(regexPattern)

	if (match) {
		let intlCode = match[1] ? `+${match[1]} ` : `+${code} ` // Use the matched code or the provided code

		const divider = code === '1' ? '-' : ' '
		const number = [
			intlCode,
			'',
			match[2],
			divider,
			match[3],
			divider,
			match[4],
		]
			.join('')
			.replace(/-+$/, '')

		return number
	}

	return null
}

export function isValidNumber(number: string) {
	const code = getCode(number)

	const formatted = formatNumberWithCode(number, code)?.replace(/[^0-9]/g, '')
	return formatted?.length === 11 || formatted?.length === 12
}

function getCode(number: string) {
	let code = `1` // Default to North American country code

	const cleaned = number.replace(/(?!^\+)[^\d]/g, '')

	// Explicitly check for '+' sign to distinguish international codes
	if (
		cleaned.startsWith('+90') ||
		(cleaned.startsWith('90') && cleaned.length > 10)
	) {
		code = `90`
	} else if (
		cleaned.startsWith('+49') ||
		(cleaned.startsWith('49') && cleaned.length > 10)
	) {
		code = `49`
	}
	// Adjust the condition to ensure that '905...' numbers without a '+' are treated as North American
	else if (cleaned.startsWith('905') && cleaned.length === 10) {
		code = `1`
	}

	return code
}

export default function formatPhoneNumber(
	val: string,
	shouldFailSilently = true
): string {
	const code = getCode(val)
	const formatted = formatNumberWithCode(val, code)

	if (!formatted) {
		if (!shouldFailSilently) {
			throw new Error('INVALID_PHONE_NUMBER')
		} else {
			return val
		}
	}

	// remove trailing spaces
	const cleaned = formatted.replace(/\s+$/, '')

	return cleaned
}

export function isDummyNumber(phone: string) {
	const cleanedValue = phone.replace(/\D/g, '')
	return cleanedValue.startsWith('1555') || cleanedValue.startsWith('555')
}
