function formatUsNumber(phoneNumberString: string) {
	if (phoneNumberString.match(/[a-zA-Z]/g)) {
		return null
	}

	let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
	let match = cleaned.match(/^(1|)?(\d{3})(\d{0,3})(\d{0,4})$/)

	if (match) {
		let intlCode = match[1] ? '+1 ' : '+1 '

		const number = [intlCode, '', match[2], '-', match[3], '-', match[4]]
			.join('')
			.replace(/-+$/, '')

		return number
	}
	return null
}

export function isValidNumber(number: string) {
	const formatted = formatUsNumber(number)?.replace(/[^0-9]/g, '')
	return formatted?.length === 11
}

export default function formatPhoneNumber(
	val: string,
	shouldFailSilently = true
): string {
	const formatted = formatUsNumber(val)

	if (!formatted) {
		if (!shouldFailSilently) {
			throw new Error('INVALID_PHONE_NUMBER')
		} else {
			return val
		}
	}

	return formatted
	// const PNF = libPhoneNumber.PhoneNumberFormat
	// const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance()
	// let num = val
	// try {
	// 	// First try parsing it as an international number
	// 	// @ts-ignore: Upgrade to google-libphonenumber@^3
	// 	num = phoneUtil.parse(val)
	// } catch (e) {
	// 	// Try parsing it as a US number
	// 	// log.debug('Unable to parse number as international number')
	// 	try {
	// 		// @ts-ignore: Upgrade to google-libphonenumber@^3
	// 		num = phoneUtil.parse(val, 'US')
	// 	} catch (err) {
	// 		// Log.debug('Unable to parse number as international or US number')
	// 	}
	// }
	// let formattedNumber = num
	// try {
	// 	// @ts-ignore: Upgrade to google-libphonenumber@^3
	// 	formattedNumber = phoneUtil.format(num, PNF.INTERNATIONAL)
	// } catch (e) {
	// 	// Log.debug('Unable to format phone number')
	// 	if (!failSilently) {
	// 		throw new Error('INVALID_PHONE_NUMBER')
	// 	}
	// }
	// if (!failSilently) {
	// 	let isValid
	// 	const cleanedValue = val.replace(/\D/g, '')
	// 	if (isDummyNumber(val)) {
	// 		isValid = cleanedValue.length === 11 || cleanedValue.length === 10
	// 	} else {
	// 		isValid = isValidNumber(formattedNumber)
	// 	}
	// 	if (!isValid) {
	// 		throw new Error('INVALID_PHONE_NUMBER')
	// 	}
	// }
	// return formattedNumber
}

export function isDummyNumber(phone: string) {
	const cleanedValue = phone.replace(/\D/g, '')
	return cleanedValue.startsWith('1555') || cleanedValue.startsWith('555')
}
