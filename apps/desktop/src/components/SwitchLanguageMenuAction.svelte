<script lang="ts">
	import { SHORTCUT_SERVICE } from '$lib/shortcuts/shortcutService';
	import { inject } from '@gitbutler/core/context';
	import { toggleLocale, getCurrentLocale, getLocaleName } from '$lib/i18n/languageService';
	import { locale } from 'svelte-i18n';

	const shortcutService = inject(SHORTCUT_SERVICE);

	let currentLocale = $state(getCurrentLocale());

	// Subscribe to locale changes
	$effect(() => {
		const unsub = locale.subscribe((newLocale) => {
			if (newLocale) {
				currentLocale = newLocale as 'en' | 'zh';
			}
		});
		return unsub;
	});

	function switchLanguage() {
		const newLocale = toggleLocale();
		currentLocale = newLocale;
	}

	// Register keyboard shortcut
	$effect(() => shortcutService.on('switch-language', () => switchLanguage()));
</script>

<!-- This component can be added to a menu -->
<!-- Usage: Add a button or menu item that calls switchLanguage() -->
<!-- Current locale: {getLocaleName(currentLocale)} -->
