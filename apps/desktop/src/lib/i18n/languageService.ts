import { locale, type Locale } from 'svelte-i18n';

const LOCALE_STORAGE_KEY = 'gitbutler-locale';

export type SupportedLocale = 'en' | 'zh';

const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'zh'];

/**
 * Get the initial locale based on browser settings or saved preference
 */
function getInitialLocale(): SupportedLocale {
	if (typeof window === 'undefined') return 'en';

	// Try to get saved preference
	const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
	if (saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)) {
		return saved as SupportedLocale;
	}

	// Try to use browser language
	const browserLang = navigator.language;
	if (browserLang.startsWith('zh')) {
		return 'zh';
	}

	return 'en';
}

/**
 * Set the current locale and save it to localStorage
 */
export function setLocale(newLocale: SupportedLocale) {
	if (SUPPORTED_LOCALES.includes(newLocale)) {
		locale.set(newLocale as Locale);
		if (typeof window !== 'undefined') {
			localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
		}
	}
}

/**
 * Get the current locale value (synchronous)
 */
export function getCurrentLocale(): SupportedLocale {
	let currentLocale: SupportedLocale = 'en';
	locale.subscribe((value) => {
		if (value) {
			currentLocale = value as SupportedLocale;
		}
	})();

	return currentLocale;
}

/**
 * Initialize the locale on app startup
 */
export function initLocale() {
	const initialLocale = getInitialLocale();
	setLocale(initialLocale);
}

/**
 * Toggle between English and Chinese
 */
export function toggleLocale() {
	const current = getCurrentLocale();
	const newLocale = current === 'en' ? 'zh' : 'en';
	setLocale(newLocale);
	return newLocale;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): SupportedLocale[] {
	return [...SUPPORTED_LOCALES];
}

/**
 * Get locale display name
 */
export function getLocaleName(localeCode: SupportedLocale): string {
	const names: Record<SupportedLocale, string> = {
		en: 'English',
		zh: '中文'
	};
	return names[localeCode] || localeCode;
}
