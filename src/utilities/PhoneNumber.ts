// import logger from '@sprucelabs/log'

import { isValidNumber } from 'libphonenumber-js'
import libPhoneNumber from 'google-libphonenumber'

// @ts-ignore
// const log = logger.log

// TODO scrap this when we move to Schema centralized formatting and validating
export default class PhoneNumber {
	public static format(val: string, failSilently = true): string {
		const PNF = libPhoneNumber.PhoneNumberFormat
		const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance()
		let num = val
		try {
			// First try parsing it as an international number
			// @ts-ignore: Upgrade to google-libphonenumber@^3
			num = phoneUtil.parse(val)
		} catch (e) {
			// Try parsing it as a US number
			// log.debug('Unable to parse number as international number')
			try {
				// @ts-ignore: Upgrade to google-libphonenumber@^3
				num = phoneUtil.parse(val, 'US')
			} catch (err) {
				// log.debug('Unable to parse number as international or US number')
			}
		}
		let formattedNumber = num
		try {
			// @ts-ignore: Upgrade to google-libphonenumber@^3
			formattedNumber = phoneUtil.format(num, PNF.INTERNATIONAL)
		} catch (e) {
			// log.debug('Unable to format phone number')
			if (!failSilently) {
				throw new Error('INVALID_PHONENUMBER')
			}
		}

		if (!failSilently) {
			let isValid
			const cleanedValue = val.replace(/\D/g, '') // strip all non-numeric
			if (cleanedValue.startsWith('1555')) {
				// TODO: need solution for international
				isValid = cleanedValue.length === 11
			} else {
				isValid = isValidNumber(formattedNumber)
			}

			if (!isValid) {
				throw new Error('INVALID_PHONENUMBER')
			}
		}

		return formattedNumber
	}
}
