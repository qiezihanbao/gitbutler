<script lang="ts">
	import ReduxResult from '$components/ReduxResult.svelte';
	import { projectRunCommitHooks } from '$lib/config/config';
	import { PROJECTS_SERVICE } from '$lib/project/projectsService';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { CardGroup, Spacer, Textarea, Textbox, Toggle } from '@gitbutler/ui';

	const { projectId }: { projectId: string } = $props();

	const projectsService = inject(PROJECTS_SERVICE);
	const projectQuery = $derived(projectsService.getProject(projectId));

	const runCommitHooks = $derived(projectRunCommitHooks(projectId));
</script>

<CardGroup>
	<ReduxResult {projectId} result={projectQuery.result}>
		{#snippet children(project)}
			<div class="fields-wrapper">
				<Textbox label={$t('settings.project_path')} readonly id="path" value={project?.path} />
				<div class="description-wrapper">
					<Textbox
						label={$t('settings.project_name')}
						id="name"
						placeholder={$t('settings.project_name_empty')}
						value={project.title}
						required
						onchange={(value: string) => {
							projectsService.updateProject({ ...project, title: value });
						}}
					/>
					<Textarea
						id="description"
						minRows={3}
						maxRows={6}
						placeholder={$t('settings.project_description')}
						value={project.description}
						oninput={(e: Event) => {
							const target = e.currentTarget as HTMLTextAreaElement;
							projectsService.updateProject({ ...project, description: target.value });
						}}
					/>
				</div>
			</div>
		{/snippet}
	</ReduxResult>
</CardGroup>

<Spacer />

<CardGroup>
	<CardGroup.Item labelFor="runHooks">
		{#snippet title()}
			{$t('settings.run_git_hook')}
		{/snippet}
		{#snippet caption()}
			{$t('settings.run_git_hook_description')}
		{/snippet}
		{#snippet actions()}
			<Toggle id="runHooks" bind:checked={$runCommitHooks} />
		{/snippet}
	</CardGroup.Item>
</CardGroup>

<Spacer />

<style>
	.fields-wrapper {
		display: flex;
		flex-direction: column;
		padding: 16px;
		gap: 16px;
	}

	.description-wrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
