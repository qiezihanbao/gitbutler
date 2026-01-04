<script lang="ts">
	import CommitSigningForm from '$components/CommitSigningForm.svelte';
	import KeysForm from '$components/KeysForm.svelte';
	import ReduxResult from '$components/ReduxResult.svelte';
	import SettingsSection from '$components/SettingsSection.svelte';
	import { BACKEND } from '$lib/backend';
	import { PROJECTS_SERVICE } from '$lib/project/projectsService';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { CardGroup, Spacer, Toggle } from '@gitbutler/ui';
	import type { Project } from '$lib/project/project';

	const { projectId }: { projectId: string } = $props();
	const projectsService = inject(PROJECTS_SERVICE);
	const projectQuery = $derived(projectsService.getProject(projectId));
	const backend = inject(BACKEND);

	async function onForcePushClick(project: Project, value: boolean) {
		await projectsService.updateProject({ ...project, ok_with_force_push: value });
	}

	async function onForcePushProtectionClick(project: Project, value: boolean) {
		await projectsService.updateProject({ ...project, force_push_protection: value });
	}
</script>

<SettingsSection>
	<CommitSigningForm {projectId} />
	{#if backend.platformName !== 'windows'}
		<Spacer />
		<KeysForm {projectId} showProjectName={false} />
	{/if}

	<Spacer />
	<ReduxResult {projectId} result={projectQuery.result}>
		{#snippet children(project)}
			<CardGroup>
				<CardGroup.Item labelFor="allowForcePush">
					{#snippet title()}
						{$t('settings.allow_force_pushing')}
					{/snippet}
					{#snippet caption()}
						{$t('settings.allow_force_pushing_description')}
					{/snippet}
					{#snippet actions()}
						<Toggle
							id="allowForcePush"
							checked={project.ok_with_force_push}
							onchange={(checked) => onForcePushClick(project, checked)}
						/>
					{/snippet}
				</CardGroup.Item>
				<CardGroup.Item labelFor="forcePushProtection">
					{#snippet title()}
						{$t('settings.force_push_protection')}
					{/snippet}
					{#snippet caption()}
						{$t('settings.force_push_protection_description')}
					{/snippet}
					{#snippet actions()}
						<Toggle
							id="forcePushProtection"
							checked={project.force_push_protection}
							onchange={(checked) => onForcePushProtectionClick(project, checked)}
						/>
					{/snippet}
				</CardGroup.Item>
			</CardGroup>
		{/snippet}
	</ReduxResult>
</SettingsSection>
