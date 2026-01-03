<script lang="ts">
	import { setLocale, getCurrentLocale, getLocaleName, getSupportedLocales } from '$lib/i18n/languageService';
	import { _ } from '$lib/i18n/i18n';
	import type { SupportedLocale } from '$lib/i18n/languageService';

	let selectedLocale = $state<SupportedLocale>(getCurrentLocale());

	function handleLocaleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newLocale = target.value as SupportedLocale;
		selectedLocale = newLocale;
		setLocale(newLocale);
	}
</script>

<div class="language-selector">
	<label for="locale-select">{_('settings.language')}</label>
	<select id="locale-select" bind:value={selectedLocale} onchange={handleLocaleChange}>
		{#each getSupportedLocales() as locale}
			<option value={locale}>{getLocaleName(locale)}</option>
		{/each}
	</select>
</div>

<style>
	.language-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.language-selector label {
		font-weight: 500;
	}

	.language-selector select {
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--gb-border-color, #ccc);
		border-radius: 4px;
		background-color: var(--gb-bg-color, #fff);
		color: var(--gb-text-color, #000);
		cursor: pointer;
	}

	.language-selector select:hover {
		border-color: var(--gb-border-hover-color, #999);
	}
</style>
