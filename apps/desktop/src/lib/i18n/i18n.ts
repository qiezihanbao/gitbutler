import { init, register, locale } from 'svelte-i18n';
import { initLocale } from './languageService';

// Register locale files for lazy loading
register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));

// Initialize i18n with default fallback
init({
	fallbackLocale: 'en',
	initialLocale: 'en'
});

// Initialize locale from user preference or browser settings
// Only run in browser environment to avoid SSR issues
if (typeof window !== 'undefined') {
	initLocale();
}

// Export i18n utilities
export { _, locale, t, addMessages, isLoading, locales, dictionary } from 'svelte-i18n';
export type { TranslateFunction, Messages } from 'svelte-i18n';
