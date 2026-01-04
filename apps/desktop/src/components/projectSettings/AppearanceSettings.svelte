<script lang="ts">
	import ThemeSelector from '$components/ThemeSelector.svelte';
	import { stagingBehaviorFeature, type StagingBehavior } from '$lib/config/uiFeatureFlags';
	import { SETTINGS } from '$lib/settings/userSettings';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import {
		CardGroup,
		HunkDiff,
		RadioButton,
		Select,
		SelectItem,
		Textbox,
		Toggle
	} from '@gitbutler/ui';
	import type { ScrollbarVisilitySettings } from '@gitbutler/ui/components/scroll/Scrollbar.svelte';

	const userSettings = inject(SETTINGS);
	const diff = `@@ -56,10 +56,10 @@
			// Diff example
			projectName={project.title}
			{remoteBranches}
			on:branchSelected={async (e) => {
-				selectedBranch = e.detail;
-				if ($platformName === 'win32') {
+				if ($platformName === 'win64' && $userSettings.enableAdvancedFeatures) {
+					// Enhanced platform detection with feature flags
					setTarget();
				}
			}}`;

	function onScrollbarFormChange(form: HTMLFormElement) {
		const formData = new FormData(form);
		const selectedScrollbarVisibility = formData.get(
			'scrollBarVisibilityType'
		) as ScrollbarVisilitySettings;

		userSettings.update((s) => ({
			...s,
			scrollbarVisibilityState: selectedScrollbarVisibility
		}));
	}

	function onStagingBehaviorFormChange(form: HTMLFormElement) {
		const formData = new FormData(form);
		const selectedStagingBehavior = formData.get('stagingBehaviorType') as StagingBehavior | null;
		if (!selectedStagingBehavior) return;
		stagingBehaviorFeature.set(selectedStagingBehavior);
	}
</script>

<CardGroup.Item standalone>
	{#snippet title()}
		Theme
	{/snippet}
	<ThemeSelector {userSettings} />
</CardGroup.Item>

<CardGroup.Item alignment="center" standalone>
	{#snippet title()}
		{$t('settings.default_file_list_mode')}
	{/snippet}
	{#snippet caption()}
		{$t('settings.default_file_list_mode_description')}
	{/snippet}
	{#snippet actions()}
		<Select
			maxWidth={120}
			value={$userSettings.defaultFileListMode}
			options={[
				{ label: $t('settings.list_view'), value: 'list' },
				{ label: $t('settings.tree_view'), value: 'tree' }
			]}
			onselect={(value) => {
				userSettings.update((s) => ({
					...s,
					defaultFileListMode: value as 'tree' | 'list'
				}));
			}}
		>
			{#snippet itemSnippet({ item, highlighted })}
				<SelectItem selected={item.value === $userSettings.defaultFileListMode} {highlighted}>
					{item.label}
				</SelectItem>
			{/snippet}
		</Select>
	{/snippet}
</CardGroup.Item>

<CardGroup>
	<CardGroup.Item alignment="center">
		{#snippet title()}
			{$t('settings.diff_preview')}
		{/snippet}

		<HunkDiff
			filePath="test.tsx"
			tabSize={$userSettings.tabSize}
			wrapText={$userSettings.wrapText}
			diffFont={$userSettings.diffFont}
			diffLigatures={$userSettings.diffLigatures}
			diffContrast={$userSettings.diffContrast}
			colorBlindFriendly={$userSettings.colorBlindFriendly}
			inlineUnifiedDiffs={$userSettings.inlineUnifiedDiffs}
			hunkStr={diff}
		/>
	</CardGroup.Item>

	<CardGroup.Item>
		{#snippet title()}
			{$t('settings.font_family')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.font_family_description')}
		{/snippet}

		<Textbox
			wide
			bind:value={$userSettings.diffFont}
			required
			onchange={(value: string) => {
				userSettings.update((s) => ({
					...s,
					diffFont: value
				}));
			}}
		/>
	</CardGroup.Item>

	<CardGroup.Item labelFor="allowDiffLigatures">
		{#snippet title()}
			{$t('settings.allow_font_ligatures')}
		{/snippet}
		{#snippet actions()}
			<Toggle
				id="allowDiffLigatures"
				checked={$userSettings.diffLigatures}
				onclick={() => {
					userSettings.update((s) => ({
						...s,
						diffLigatures: !$userSettings.diffLigatures
					}));
				}}
			/>
		{/snippet}
	</CardGroup.Item>

	<CardGroup.Item alignment="center">
		{#snippet title()}
			{$t('settings.tab_size')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.tab_size_description')}
		{/snippet}

		{#snippet actions()}
			<Textbox
				type="number"
				width={100}
				textAlign="center"
				value={$userSettings.tabSize.toString()}
				minVal={1}
				maxVal={8}
				showCountActions
				onchange={(value: string) => {
					userSettings.update((s) => ({
						...s,
						tabSize: parseInt(value) || $userSettings.tabSize
					}));
				}}
				placeholder={$userSettings.tabSize.toString()}
			/>
		{/snippet}
	</CardGroup.Item>

	<CardGroup.Item labelFor="wrapText">
		{#snippet title()}
			{$t('settings.soft_wrap')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.soft_wrap_description')}
		{/snippet}

		{#snippet actions()}
			<Toggle
				id="wrapText"
				checked={$userSettings.wrapText}
				onclick={() => {
					userSettings.update((s) => ({
						...s,
						wrapText: !s.wrapText
					}));
				}}
			/>
		{/snippet}
	</CardGroup.Item>

	<CardGroup.Item>
		{#snippet title()}
			{$t('settings.lines_contrast')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.lines_contrast_description')}
		{/snippet}
		{#snippet actions()}
			<Select
				maxWidth={110}
				value={$userSettings.diffContrast}
				options={[
					{ label: $t('settings.light'), value: 'light' },
					{ label: $t('settings.medium'), value: 'medium' },
					{ label: $t('settings.strong'), value: 'strong' }
				]}
				onselect={(value) => {
					userSettings.update((s) => ({
						...s,
						diffContrast: value as 'strong' | 'medium' | 'light'
					}));
				}}
			>
				{#snippet itemSnippet({ item, highlighted })}
					<SelectItem selected={item.value === $userSettings.diffContrast} {highlighted}>
						{item.label}
					</SelectItem>
				{/snippet}
			</Select>
		{/snippet}
	</CardGroup.Item>

	<CardGroup.Item labelFor="colorBlindFriendly">
		{#snippet title()}
			{$t('settings.color_blind_friendly')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.color_blind_friendly_description')}
		{/snippet}
		{#snippet actions()}
			<Toggle
				id="colorBlindFriendly"
				checked={$userSettings.colorBlindFriendly}
				onclick={() => {
					userSettings.update((s) => ({
						...s,
						colorBlindFriendly: !s.colorBlindFriendly
					}));
				}}
			/>
		{/snippet}
	</CardGroup.Item>

	<CardGroup.Item labelFor="inlineUnifiedDiffs">
		{#snippet title()}
			{$t('settings.display_word_diffs_inline')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.display_word_diffs_inline_description')}
		{/snippet}
		{#snippet actions()}
			<Toggle
				id="inlineUnifiedDiffs"
				checked={$userSettings.inlineUnifiedDiffs}
				onclick={() => {
					userSettings.update((s) => ({
						...s,
						inlineUnifiedDiffs: !s.inlineUnifiedDiffs
					}));
				}}
			/>
		{/snippet}
	</CardGroup.Item>
</CardGroup>

<CardGroup>
	<form class="stack-v" onchange={(e) => onScrollbarFormChange(e.currentTarget)}>
		<CardGroup.Item labelFor="scrollbar-on-scroll">
			{#snippet title()}
				{$t('settings.scrollbar_on_scroll')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.scrollbar_on_scroll_description')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="scrollBarVisibilityType"
					value="scroll"
					id="scrollbar-on-scroll"
					checked={$userSettings.scrollbarVisibilityState === 'scroll'}
				/>
			{/snippet}
		</CardGroup.Item>

		<CardGroup.Item labelFor="scrollbar-on-hover">
			{#snippet title()}
				{$t('settings.scrollbar_on_hover')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.scrollbar_on_hover_description')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="scrollBarVisibilityType"
					value="hover"
					id="scrollbar-on-hover"
					checked={$userSettings.scrollbarVisibilityState === 'hover'}
				/>
			{/snippet}
		</CardGroup.Item>

		<CardGroup.Item labelFor="scrollbar-always">
			{#snippet title()}
				{$t('settings.always_show_scrollbar')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="scrollBarVisibilityType"
					value="always"
					id="scrollbar-always"
					checked={$userSettings.scrollbarVisibilityState === 'always'}
				/>
			{/snippet}
		</CardGroup.Item>
	</form>
</CardGroup>

<CardGroup>
	<form class="stack-v" onchange={(e) => onStagingBehaviorFormChange(e.currentTarget)}>
		<CardGroup.Item labelFor="stage-all">
			{#snippet title()}
				{$t('settings.stage_all_files')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.stage_all_files_description')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="stagingBehaviorType"
					value="all"
					id="stage-all"
					checked={$stagingBehaviorFeature === 'all'}
				/>
			{/snippet}
		</CardGroup.Item>

		<CardGroup.Item labelFor="stage-selection">
			{#snippet title()}
				{$t('settings.stage_selected_files')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.stage_selected_files_description')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="stagingBehaviorType"
					value="selection"
					id="stage-selection"
					checked={$stagingBehaviorFeature === 'selection'}
				/>
			{/snippet}
		</CardGroup.Item>

		<CardGroup.Item labelFor="stage-none">
			{#snippet title()}
				{$t('settings.dont_stage_files_automatically')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.dont_stage_files_automatically_description')}
			{/snippet}
			{#snippet actions()}
				<RadioButton
					name="stagingBehaviorType"
					value="none"
					id="stage-none"
					checked={$stagingBehaviorFeature === 'none'}
				/>
			{/snippet}
		</CardGroup.Item>
	</form>
</CardGroup>
