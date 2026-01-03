import { dictionary, locale } from '$lib/i18n/i18n';
import enTranslations from '$lib/i18n/locales/en.json';
import zhTranslations from '$lib/i18n/locales/zh.json';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';
import type { Locale } from 'svelte-i18n';

interface MenuTranslations {
	file: string;
	edit: string;
	view: string;
	project: string;
	window: string;
	help: string;
	add_local_repo: string;
	clone_repo: string;
	create_branch: string;
	create_dependent_branch: string;
	close_window: string;
	fullscreen: string;
	switch_theme: string;
	toggle_sidebar: string;
	zoom_in: string;
	zoom_out: string;
	zoom_reset: string;
	devtools: string;
	reload_view: string;
	operations_history: string;
	open_in_editor: string;
	show_in_finder: string;
	show_in_explorer: string;
	show_in_file_manager: string;
	project_settings: string;
	minimize: string;
	maximize: string;
	documentation: string;
	debugging_guide: string;
	source_code: string;
	release_notes: string;
	share_debug_info: string;
	create_issue: string;
	open_logs_folder: string;
	open_config_folder: string;
	discord: string;
	youtube: string;
	bluesky: string;
	x: string;
	version: string;
}

/**
 * Get translation value by key for current locale
 */
function getTranslation(key: string): string {
	const currentLocale = locale.get() as Locale;
	const dict = dictionary.get();

	if (dict && dict[currentLocale]) {
		const keys = key.split('.');
		let value: any = dict[currentLocale];
		for (const k of keys) {
			value = value?.[k];
		}
		return value || key;
	}

	// Fallback to imported JSON files
	const translations = currentLocale === 'zh' ? zhTranslations : enTranslations;
	const keys = key.split('.');
	let value: any = translations;
	for (const k of keys) {
		value = value?.[k];
	}
	return value || key;
}

/**
 * Build translated menu items and send to Rust backend
 */
export async function buildI18nMenu(): Promise<void> {
	try {
		const platformName = await platform();
		const version = await getVersion();

		const translations: MenuTranslations = {
			file: getTranslation('menu.file'),
			edit: getTranslation('menu.edit'),
			view: getTranslation('menu.view'),
			project: getTranslation('menu.project'),
			window: getTranslation('menu.window'),
			help: getTranslation('menu.help'),
			add_local_repo: getTranslation('menu.add_local_repo'),
			clone_repo: getTranslation('menu.clone_repo'),
			create_branch: getTranslation('menu.create_branch'),
			create_dependent_branch: getTranslation('menu.create_dependent_branch'),
			close_window: getTranslation('menu.close_window'),
			fullscreen: getTranslation('menu.fullscreen'),
			switch_theme: getTranslation('menu.switch_theme'),
			toggle_sidebar: getTranslation('menu.toggle_sidebar'),
			zoom_in: getTranslation('menu.zoom_in'),
			zoom_out: getTranslation('menu.zoom_out'),
			zoom_reset: getTranslation('menu.zoom_reset'),
			devtools: getTranslation('menu.devtools'),
			reload_view: getTranslation('menu.reload_view'),
			operations_history: getTranslation('menu.operations_history'),
			open_in_editor: getTranslation('menu.open_in_editor'),
			show_in_finder: getTranslation('menu.show_in_finder'),
			show_in_explorer: getTranslation('menu.show_in_explorer'),
			show_in_file_manager: getTranslation('menu.show_in_file_manager'),
			project_settings: getTranslation('menu.project_settings'),
			minimize: getTranslation('menu.minimize'),
			maximize: getTranslation('menu.maximize'),
			documentation: getTranslation('menu.documentation'),
			debugging_guide: getTranslation('menu.debugging_guide'),
			source_code: getTranslation('menu.source_code'),
			release_notes: getTranslation('menu.release_notes'),
			share_debug_info: getTranslation('menu.share_debug_info'),
			create_issue: getTranslation('menu.create_issue'),
			open_logs_folder: getTranslation('menu.open_logs_folder'),
			open_config_folder: getTranslation('menu.open_config_folder'),
			discord: getTranslation('menu.discord'),
			youtube: getTranslation('menu.youtube'),
			bluesky: getTranslation('menu.bluesky'),
			x: getTranslation('menu.x'),
			version: `${getTranslation('menu.version')} ${version}`
		};

		await invoke('build_i18n_menu', {
			translations,
			platform: platformName
		});
	} catch (error) {
		console.error('Failed to build i18n menu:', error);
	}
}

/**
 * Rebuild menu when locale changes
 */
export async function rebuildMenuOnLocaleChange(): Promise<void> {
	await buildI18nMenu();
}
