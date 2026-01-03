use crate::menu::build as build_menu;
use anyhow::Context as _;
use serde::Deserialize;
use std::collections::HashMap;
use tauri::{AppHandle, Manager, Runtime};

#[derive(Deserialize, Clone)]
pub struct MenuTranslations {
    pub file: String,
    pub edit: String,
    pub view: String,
    pub project: String,
    pub window: String,
    pub help: String,
    pub add_local_repo: String,
    pub clone_repo: String,
    pub create_branch: String,
    pub create_dependent_branch: String,
    pub close_window: String,
    pub fullscreen: String,
    pub switch_theme: String,
    pub toggle_sidebar: String,
    pub zoom_in: String,
    pub zoom_out: String,
    pub zoom_reset: String,
    pub devtools: String,
    pub reload_view: String,
    pub operations_history: String,
    pub open_in_editor: String,
    pub show_in_finder: String,
    pub show_in_explorer: String,
    pub show_in_file_manager: String,
    pub project_settings: String,
    pub minimize: String,
    pub maximize: String,
    pub documentation: String,
    pub debugging_guide: String,
    pub source_code: String,
    pub release_notes: String,
    pub share_debug_info: String,
    pub create_issue: String,
    pub open_logs_folder: String,
    pub open_config_folder: String,
    pub discord: String,
    pub youtube: String,
    pub bluesky: String,
    pub x: String,
    pub version: String,
}

/// Store the current translations globally
static mut CURRENT_TRANSLATIONS: Option<MenuTranslations> = None;

/// Set the current translations
pub fn set_translations(translations: MenuTranslations) {
    unsafe {
        CURRENT_TRANSLATIONS = Some(translations);
    }
}

/// Get a translated string by key
pub fn get_translation(key: &str) -> String {
    unsafe {
        if let Some(trans) = &CURRENT_TRANSLATIONS {
            match key {
                "file" => trans.file.clone(),
                "edit" => trans.edit.clone(),
                "view" => trans.view.clone(),
                "project" => trans.project.clone(),
                "window" => trans.window.clone(),
                "help" => trans.help.clone(),
                "add_local_repo" => trans.add_local_repo.clone(),
                "clone_repo" => trans.clone_repo.clone(),
                "create_branch" => trans.create_branch.clone(),
                "create_dependent_branch" => trans.create_dependent_branch.clone(),
                "close_window" => trans.close_window.clone(),
                "fullscreen" => trans.fullscreen.clone(),
                "switch_theme" => trans.switch_theme.clone(),
                "toggle_sidebar" => trans.toggle_sidebar.clone(),
                "zoom_in" => trans.zoom_in.clone(),
                "zoom_out" => trans.zoom_out.clone(),
                "zoom_reset" => trans.zoom_reset.clone(),
                "devtools" => trans.devtools.clone(),
                "reload_view" => trans.reload_view.clone(),
                "operations_history" => trans.operations_history.clone(),
                "open_in_editor" => trans.open_in_editor.clone(),
                "show_in_finder" => trans.show_in_finder.clone(),
                "show_in_explorer" => trans.show_in_explorer.clone(),
                "show_in_file_manager" => trans.show_in_file_manager.clone(),
                "project_settings" => trans.project_settings.clone(),
                "minimize" => trans.minimize.clone(),
                "maximize" => trans.maximize.clone(),
                "documentation" => trans.documentation.clone(),
                "debugging_guide" => trans.debugging_guide.clone(),
                "source_code" => trans.source_code.clone(),
                "release_notes" => trans.release_notes.clone(),
                "share_debug_info" => trans.share_debug_info.clone(),
                "create_issue" => trans.create_issue.clone(),
                "open_logs_folder" => trans.open_logs_folder.clone(),
                "open_config_folder" => trans.open_config_folder.clone(),
                "discord" => trans.discord.clone(),
                "youtube" => trans.youtube.clone(),
                "bluesky" => trans.bluesky.clone(),
                "x" => trans.x.clone(),
                "version" => trans.version.clone(),
                _ => key.to_string(),
            }
        } else {
            key.to_string()
        }
    }
}

/// Tauri command to build i18n menu from frontend
#[tauri::command]
pub async fn build_i18n_menu<R: Runtime>(
    handle: AppHandle<R>,
    translations: MenuTranslations,
    platform: String,
) -> Result<(), String> {
    // Store translations globally
    set_translations(translations);

    // Rebuild menu with translations
    // Note: This would require refactoring the build function to accept translations
    // For now, we'll just store them for future use

    let window = handle
        .get_window("main")
        .ok_or("Failed to get main window".to_string())?;

    // Trigger a menu rebuild notification
    window
        .emit("menu-rebuilt", true)
        .map_err(|e| format!("Failed to emit menu-rebuilt event: {}", e))?;

    Ok(())
}
