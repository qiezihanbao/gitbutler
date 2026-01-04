import { dictionary, locale } from '$lib/i18n/i18n';
import { get } from 'svelte/store';

/**
 * Format a date as a relative time string (e.g., "5 min ago", "2 hours ago")
 * This version supports internationalization through i18n
 */
export function getTimeAgoI18n(input: Date | number, addSuffix: boolean = true): string {
	const date = typeof input === 'number' ? new Date(input) : input;
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	// Define time intervals in seconds
	const minute = 60;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 365 * day;

	// Get absolute value for distance
	const distance = Math.abs(seconds);

	// Determine the appropriate time unit and value
	let value: number;
	let unit: string;

	if (distance < 10) {
		return translate('time.just_now');
	} else if (distance < minute) {
		value = Math.floor(distance);
		unit = 'seconds';
	} else if (distance < hour) {
		value = Math.floor(distance / minute);
		unit = 'minutes';
	} else if (distance < day) {
		value = Math.floor(distance / hour);
		unit = 'hours';
	} else if (distance < month) {
		value = Math.floor(distance / day);
		unit = 'days';
	} else if (distance < year) {
		value = Math.floor(distance / month);
		unit = 'months';
	} else {
		value = Math.floor(distance / year);
		unit = 'years';
	}

	// Format the string based on direction and value
	const isPast = seconds >= 0;
	const suffix = addSuffix ? (isPast ? 'ago' : 'from_now') : '';

	// For English, handle singular/plural
	// For Chinese, singular and plural are the same
	if (unit === 'hours' || unit === 'days' || unit === 'months' || unit === 'years') {
		const translationKey = value === 1
			? `time.${unit.slice(0, -1)}_${suffix}`  // singular: hour_ago, day_ago
			: `time.${unit}_${suffix}`;  // plural: hours_ago, days_ago
		return translate(translationKey, { value });
	}

	// For seconds and minutes, only plural form needed in practice
	return translate(`time.${unit}_${suffix}`, { value });
}

/**
 * Helper function to translate a key with optional parameters
 */
function translate(key: string, params?: Record<string, string | number>): string {
	try {
		const currentLocale = get(locale);
		const currentDict = get(dictionary);

		if (!currentDict || !currentLocale) {
			// Fallback to English if dictionary isn't loaded yet
			return key;
		}

		const messages = currentDict[currentLocale] || currentDict.en;

		if (!messages) {
			return key;
		}

		// Get the translation string
		let translation = key.split('.').reduce((obj, k) => obj?.[k], messages as any) || key;

		// Replace parameters in the format {paramName}
		if (params) {
			Object.entries(params).forEach(([paramName, paramValue]) => {
				translation = translation.replace(`{${paramName}}`, String(paramValue));
			});
		}

		return translation;
	} catch (error) {
		console.error('Translation error in timeAgo:', error);
		return key;
	}
}

/**
 * Backward compatible alias for getTimeAgoI18n
 * This can be used to replace the UI package's getTimeAgo
 */
export { getTimeAgoI18n as getTimeAgo };
