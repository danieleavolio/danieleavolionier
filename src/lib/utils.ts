type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'it') {
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}

export function calculateReadingTime(content: string = ''): number {
	if (!content) return 1;
	const text = content.replace(/<[^>]+>/g, ' ');
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 200));
}
