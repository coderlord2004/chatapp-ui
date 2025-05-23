function formatDateTime(isoString: string) {
	if (!isoString) return;
	const date = new Date(isoString);

	const weekday = date.toLocaleDateString('en-US', {
		weekday: 'long',
		timeZone: 'UTC',
	});

	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'UTC',
	});

	const formattedTime = date.toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		timeZone: 'UTC',
	});

	return `${weekday}, ${formattedDate} ${formattedTime}`;
}

function formatTime(isoString: string) {
	if (!isoString) return;
	const date = new Date(isoString);

	return date.toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		timeZone: 'UTC',
	});
}

export { formatDateTime, formatTime };
