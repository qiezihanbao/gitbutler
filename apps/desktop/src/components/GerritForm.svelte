<script lang="ts">
	import ReduxResult from '$components/ReduxResult.svelte';
	import { GIT_CONFIG_SERVICE } from '$lib/config/gitConfigService';
	import { PROJECTS_SERVICE } from '$lib/project/projectsService';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { CardGroup, Link, Toggle } from '@gitbutler/ui';

	type Props = {
		projectId: string;
	};

	const { projectId }: Props = $props();

	const gbConfig = inject(GIT_CONFIG_SERVICE);
	const projectService = inject(PROJECTS_SERVICE);

	const isGerritProject = $derived(projectService.isGerritProject(projectId));
</script>

<div class="stack-v">
	<ReduxResult {projectId} result={isGerritProject.result}>
		{#snippet children(itIsAGerritProject)}
			<CardGroup.Item standalone labelFor="gerritModeToggle">
				{#snippet title()}
					{$t('settings.gerrit_configuration')}
				{/snippet}

				{#snippet caption()}
					{$t('settings.gerrit_configuration_description')}
					<Link href="https://docs.gitbutler.com/features/gerrit-mode">{$t('common.learn_more')}</Link>
				{/snippet}

				{#snippet actions()}
					<Toggle
						id="gerritModeToggle"
						checked={itIsAGerritProject}
						onclick={() => gbConfig.setGerritMode(projectId, !itIsAGerritProject)}
					/>
				{/snippet}
			</CardGroup.Item>
		{/snippet}
	</ReduxResult>
</div>
