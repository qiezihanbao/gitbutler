<script lang="ts">
	import CloudForm from '$components/CloudForm.svelte';
	import GitForm from '$components/GitForm.svelte';
	import PreferencesForm from '$components/PreferencesForm.svelte';
	import SettingsModalLayout from '$components/SettingsModalLayout.svelte';
	import AgentSettings from '$components/projectSettings/AgentSettings.svelte';
	import GeneralSettings from '$components/projectSettings/GeneralSettings.svelte';
	import { projectDisableCodegen } from '$lib/config/config';
	import { t } from '$lib/i18n/i18n';
	import iconsJson from '@gitbutler/ui/data/icons.json';
	import type { ProjectSettingsModalState } from '$lib/state/uiState.svelte';

	type Props = {
		data: ProjectSettingsModalState;
	};

	const { data }: Props = $props();

	const codegenDisabled = $derived(projectDisableCodegen(data.projectId));

	const allPages = [
		{
			id: 'project',
			label: $t('settings.project'),
			icon: 'profile' as keyof typeof iconsJson
		},
		{
			id: 'git',
			label: $t('settings.git_stuff'),
			icon: 'git' as keyof typeof iconsJson
		},
		{
			id: 'ai',
			label: $t('settings.ai_options'),
			icon: 'ai' as keyof typeof iconsJson
		},
		{
			id: 'agent',
			label: $t('codegen.claude_code'),
			icon: 'ai-agent' as keyof typeof iconsJson,
			requireCodegen: true
		},
		{
			id: 'experimental',
			label: $t('settings.experimental'),
			icon: 'idea' as keyof typeof iconsJson
		}
	];

	const pages = $derived(allPages.filter((page) => !page.requireCodegen || !$codegenDisabled));

	let currentSelectedId = $derived(data.selectedId || pages.at(0)?.id);

	function selectPage(pageId: string) {
		currentSelectedId = pageId;
	}
</script>

<SettingsModalLayout
	title={$t('settings.project')}
	{pages}
	selectedId={data.selectedId}
	onSelectPage={selectPage}
>
	{#snippet content({ currentPage })}
		{#if currentPage}
			{#if currentPage.id === 'project'}
				<GeneralSettings projectId={data.projectId} />
			{:else if currentPage.id === 'git'}
				<GitForm projectId={data.projectId} />
			{:else if currentPage.id === 'ai'}
				<CloudForm projectId={data.projectId} />
			{:else if currentPage.id === 'agent'}
				<AgentSettings />
			{:else if currentPage.id === 'experimental'}
				<PreferencesForm projectId={data.projectId} />
			{:else}
				{$t('settings.page_not_found', { pageId: currentPage.id })}
			{/if}
		{:else}
			{$t('settings.page_not_found', { pageId: currentSelectedId })}
		{/if}
	{/snippet}
</SettingsModalLayout>
