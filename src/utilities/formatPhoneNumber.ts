interface DetectionInput {
    original: string
    digits: string
    hasExplicitPlus: boolean
}

interface CountryFormat {
    code: string
    groupSizes: number[]
    groupSeparator: string
    codeSeparator?: string
    validDigits?: number[]
    detect?: (input: DetectionInput) => boolean
}

const LETTER_PATTERN = /[a-zA-Z]/
const DEFAULT_CODE_SEPARATOR = ' '

const COUNTRY_FORMATS: CountryFormat[] = [
    {
        code: '92',
        groupSizes: [4, 7],
        groupSeparator: ' ',
        validDigits: [9, 10, 11],
        detect: ({ digits, hasExplicitPlus }) =>
            digits.startsWith('92') && (hasExplicitPlus || digits.length > 10),
    },
    {
        code: '90',
        groupSizes: [3, 3, 4],
        groupSeparator: ' ',
        validDigits: [10],
        detect: ({ digits, hasExplicitPlus }) =>
            digits.startsWith('90') && (hasExplicitPlus || digits.length > 10),
    },
    {
        code: '49',
        groupSizes: [3, 3, 4],
        groupSeparator: ' ',
        validDigits: [10],
        detect: ({ digits, hasExplicitPlus }) =>
            digits.startsWith('49') && (hasExplicitPlus || digits.length > 10),
    },
    {
        code: '1',
        groupSizes: [3, 3, 4],
        groupSeparator: '-',
        validDigits: [10],
    },
]

const DEFAULT_COUNTRY =
    COUNTRY_FORMATS.find((format) => format.code === '1') ?? COUNTRY_FORMATS[0]

export function isValidNumber(number: string) {
    if (LETTER_PATTERN.test(number)) {
        return false
    }

    const parsed = parseInput(number)
    const countryFormat = detectCountryFormat(parsed)
    const localDigits = stripCountryCodeFromDigits(
        parsed.digits,
        countryFormat.code
    )

    if (!localDigits.length) {
        return false
    }

    if (countryFormat.validDigits?.length) {
        return countryFormat.validDigits.includes(localDigits.length)
    }

    return true
}

export default function formatPhoneNumber(
    value: string,
    shouldFailSilently = true
): string {
    if (LETTER_PATTERN.test(value)) {
        if (!shouldFailSilently) {
            throw new Error('INVALID_PHONE_NUMBER')
        }

        return value
    }

    const parsed = parseInput(value)
    const countryFormat = detectCountryFormat(parsed)
    const localDigits = stripCountryCodeFromDigits(
        parsed.digits,
        countryFormat.code
    )

    if (!localDigits.length) {
        if (!shouldFailSilently) {
            throw new Error('INVALID_PHONE_NUMBER')
        }

        return value
    }

    const formattedLocal = formatLocalDigits(localDigits, countryFormat)
    const codeSeparator = countryFormat.codeSeparator ?? DEFAULT_CODE_SEPARATOR
    const formatted = formattedLocal
        ? `+${countryFormat.code}${codeSeparator}${formattedLocal}`
        : `+${countryFormat.code}`

    return formatted.trim()
}

export function isDummyNumber(phone: string) {
    const cleanedValue = phone.replace(/\D/g, '')
    return cleanedValue.startsWith('1555') || cleanedValue.startsWith('555')
}

function parseInput(original: string): DetectionInput {
    const digits = original.replace(/\D/g, '')
    const hasExplicitPlus = original.trim().startsWith('+')

    return {
        original,
        digits,
        hasExplicitPlus,
    }
}

function detectCountryFormat(input: DetectionInput): CountryFormat {
    if (!input.digits.length) {
        return DEFAULT_COUNTRY
    }

    if (input.hasExplicitPlus) {
        const explicitMatch = COUNTRY_FORMATS.find((format) =>
            input.digits.startsWith(format.code)
        )

        if (explicitMatch) {
            return explicitMatch
        }
    }

    const detected = COUNTRY_FORMATS.find((format) =>
        format.detect ? format.detect(input) : false
    )

    return detected ?? DEFAULT_COUNTRY
}

function stripCountryCodeFromDigits(digits: string, code: string) {
    if (digits.startsWith(code)) {
        return digits.slice(code.length)
    }

    return digits
}

function formatLocalDigits(digits: string, format: CountryFormat) {
    if (!digits.length) {
        return ''
    }

    const parts: string[] = []
    let index = 0

    for (const size of format.groupSizes) {
        if (index >= digits.length) {
            break
        }

        const nextIndex = Math.min(index + size, digits.length)
        parts.push(digits.slice(index, nextIndex))
        index = nextIndex
    }

    if (index < digits.length) {
        parts.push(digits.slice(index))
    }

    return parts.join(format.groupSeparator)
}
