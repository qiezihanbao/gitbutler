import { init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));

const INITIAL_LOCALE = 'en';

init({
	fallbackLocale: INITIAL_LOCALE,
	initialLocale: INITIAL_LOCALE
});

export { _, locale, t, addMessages, isLoading, locales, dictionary } from 'svelte-i18n';
export type { TranslateFunction, Messages } from 'svelte-i18n';
