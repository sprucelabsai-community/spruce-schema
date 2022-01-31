export default function getStartOfDay(timestamp?: number) {
	if (!timestamp) {
		timestamp = new Date().getTime()
	}

	const date = new Date(timestamp)

	date.setUTCHours(0, 0, 0, 0)

	return date.getTime()
}
