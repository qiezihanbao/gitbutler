<script lang="ts">
	import { goto } from '$app/navigation';
	import ReduxResult from '$components/ReduxResult.svelte';
	import RemoveProjectButton from '$components/RemoveProjectButton.svelte';
	import { showError } from '$lib/notifications/toasts';
	import { PROJECTS_SERVICE } from '$lib/project/projectsService';
	import { t } from '$lib/i18n/i18n';
	import { useSettingsModal } from '$lib/settings/settingsModal.svelte';
	import { inject } from '@gitbutler/core/context';

	import { CardGroup, chipToasts } from '@gitbutler/ui';

	const { projectId }: { projectId: string } = $props();

	const projectsService = inject(PROJECTS_SERVICE);
	const projectQuery = $derived(projectsService.getProject(projectId));
	const { closeSettings } = useSettingsModal();

	let isDeleting = $state(false);

	async function onDeleteClicked() {
		isDeleting = true;
		try {
			await projectsService.deleteProject(projectId);
			closeSettings();
			goto('/');
			chipToasts.success($t('settings.project_deleted'));
		} catch (err: any) {
			console.error(err);
			showError($t('settings.failed_to_delete_project'), err);
		} finally {
			isDeleting = false;
		}
	}
</script>

<ReduxResult {projectId} result={projectQuery.result}>
	{#snippet children(project)}
		<CardGroup.Item standalone>
			{#snippet title()}
				{$t('settings.remove_project')}
			{/snippet}
			{#snippet caption()}
				{$t('settings.remove_project_description')}
			{/snippet}

			<div>
				<RemoveProjectButton projectTitle={project.title} {isDeleting} {onDeleteClicked} />
			</div>
		</CardGroup.Item>
	{/snippet}
</ReduxResult>
