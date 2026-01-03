import { invoke } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/api/os';
import { getVersion } from '@tauri-apps/api/app';
import { t } from '$lib/i18n/i18n';
import type { ListenCallback } from '@tauri-apps/api/event';

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
 * Build translated menu items and send to Rust backend
 */
export async function buildI18nMenu(): Promise<void> {
	try {
		const platformName = await platform();
		const version = await getVersion();

		const translations: MenuTranslations = {
			file: $t('menu.file'),
			edit: $t('menu.edit'),
			view: $t('menu.view'),
			project: $t('menu.project'),
			window: $t('menu.window'),
			help: $t('menu.help'),
			add_local_repo: $t('menu.add_local_repo'),
			clone_repo: $t('menu.clone_repo'),
			create_branch: $t('menu.create_branch'),
			create_dependent_branch: $t('menu.create_dependent_branch'),
			close_window: $t('menu.close_window'),
			fullscreen: $t('menu.fullscreen'),
			switch_theme: $t('menu.switch_theme'),
			toggle_sidebar: $t('menu.toggle_sidebar'),
			zoom_in: $t('menu.zoom_in'),
			zoom_out: $t('menu.zoom_out'),
			zoom_reset: $t('menu.zoom_reset'),
			devtools: $t('menu.devtools'),
			reload_view: $t('menu.reload_view'),
			operations_history: $t('menu.operations_history'),
			open_in_editor: $t('menu.open_in_editor'),
			show_in_finder: $t('menu.show_in_finder'),
			show_in_explorer: $t('menu.show_in_explorer'),
			show_in_file_manager: $t('menu.show_in_file_manager'),
			project_settings: $t('menu.project_settings'),
			minimize: $t('menu.minimize'),
			maximize: $t('menu.maximize'),
			documentation: $t('menu.documentation'),
			debugging_guide: $t('menu.debugging_guide'),
			source_code: $t('menu.source_code'),
			release_notes: $t('menu.release_notes'),
			share_debug_info: $t('menu.share_debug_info'),
			create_issue: $t('menu.create_issue'),
			open_logs_folder: $t('menu.open_logs_folder'),
			open_config_folder: $t('menu.open_config_folder'),
			discord: $t('menu.discord'),
			youtube: $t('menu.youtube'),
			bluesky: $t('menu.bluesky'),
			x: $t('menu.x'),
			version: `${$t('menu.version')} ${version}`
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
