<script lang="ts">
	import GitHubAccountBadge from '$components/GitHubAccountBadge.svelte';
	import { DEFAULT_FORGE_FACTORY } from '$lib/forge/forgeFactory.svelte';
	import {
		githubAccountIdentifierToString,
		stringToGitHubAccountIdentifier
	} from '$lib/forge/github/githubUserService.svelte';
	import { usePreferredGitHubUsername } from '$lib/forge/github/hooks.svelte';
	import { GITLAB_STATE } from '$lib/forge/gitlab/gitlabState.svelte';
	import { PROJECTS_SERVICE } from '$lib/project/projectsService';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { reactive } from '@gitbutler/shared/reactiveUtils.svelte';
	import { CardGroup, InfoMessage, Link, Select, SelectItem, Spacer, Textbox } from '@gitbutler/ui';

	import type { ForgeName } from '$lib/forge/interface/forge';
	import type { Project } from '$lib/project/project';

	const { projectId }: { projectId: string } = $props();

	const forge = inject(DEFAULT_FORGE_FACTORY);
	const gitLabState = inject(GITLAB_STATE);
	const { preferredGitHubAccount, githubAccounts } = usePreferredGitHubUsername(
		reactive(() => projectId)
	);

	const token = gitLabState.token;
	const forkProjectId = gitLabState.forkProjectId;
	const upstreamProjectId = gitLabState.upstreamProjectId;
	const instanceUrl = gitLabState.instanceUrl;

	const projectsService = inject(PROJECTS_SERVICE);
	const projectQuery = $derived(projectsService.getProject(projectId));
	const project = $derived(projectQuery.response);

	const forgeOptions: { label: string; value: ForgeName }[] = [
		{
			label: 'None',
			value: 'default'
		},
		{
			label: 'GitHub',
			value: 'github'
		},
		{
			label: 'GitLab',
			value: 'gitlab'
		},
		{
			label: 'Azure',
			value: 'azure'
		},
		{
			label: 'BitBucket',
			value: 'bitbucket'
		}
	];
	let selectedOption = $derived(project?.forge_override || 'default');

	function handleSelectionChange(selectedOption: ForgeName) {
		if (!project) return;

		const mutableProject: Project & { unset_forge_override?: boolean } = structuredClone(project);

		if (selectedOption === 'default') {
			mutableProject.unset_forge_override = true;
		} else {
			mutableProject.forge_override = selectedOption;
		}
		projectsService.updateProject(mutableProject);
	}
</script>

<CardGroup>
	<CardGroup.Item>
		{#snippet title()}
			{$t('settings.forge_override')}
		{/snippet}

		{#snippet caption()}
			{#if forge.determinedForgeType === 'default'}
				{$t('settings.forge_not_detected')}
				<br />
				{$t('settings.forge_not_detected_description')}
				<br />
				<span class="text-bold">{$t('common.note')}:</span> {$t('settings.forge_not_supported')}
			{:else}
				{@const forgeType = forge.determinedForgeType.toUpperCase()}
				{$t('settings.forge_detected', { forgeType })}
				<br />
				{$t('settings.forge_cannot_override')}
			{/if}
		{/snippet}

		{#if forge.determinedForgeType === 'default'}
			<Select
				value={selectedOption}
				options={forgeOptions}
				wide
				onselect={(value) => {
					selectedOption = value as ForgeName;
					handleSelectionChange(selectedOption);
				}}
			>
				{#snippet itemSnippet({ item, highlighted })}
					<SelectItem selected={item.value === selectedOption} {highlighted}>
						{item.label}
					</SelectItem>
				{/snippet}
			</Select>
		{/if}
	</CardGroup.Item>

	{#if forge.current.name === 'gitlab'}
		<CardGroup.Item>
			{#snippet title()}
				Configure GitLab integration
			{/snippet}

			{#snippet caption()}
				Learn how to find your GitLab Personal Token and Project ID in our <Link
					href="https://docs.gitbutler.com/features/forge-integration/gitlab-integration">docs</Link
				>
				<br />
				The Fork Project ID is where branches are pushed; the Upstream Project ID is where merge requests
				are created.
			{/snippet}

			<Textbox
				label="Personal token"
				type="password"
				value={$token}
				oninput={(value) => ($token = value)}
			/>
			<Textbox
				label="Your fork's project ID"
				value={$forkProjectId}
				oninput={(value) => ($forkProjectId = value)}
			/>
			<Textbox
				label="Upstream project ID"
				value={$upstreamProjectId}
				oninput={(value) => ($upstreamProjectId = value)}
			/>
			<Textbox
				label="Instance URL"
				value={$instanceUrl}
				oninput={(value) => ($instanceUrl = value)}
			/>

			<Spacer margin={5} />

			<p class="text-12 text-body clr-text-2">
				For custom GitLab instances (not gitlab.com), add them as a custom CSP entry so GitButler
				can connect. Read more in the <Link
					href="https://docs.gitbutler.com/troubleshooting/custom-csp">docs</Link
				>
			</p>
		</CardGroup.Item>
	{/if}

	{#if forge.current.name === 'github'}
		<CardGroup.Item>
			{#snippet title()}
				{$t('settings.configure_github_integration')}
			{/snippet}

			{#snippet caption()}
				{$t('settings.enable_pull_request_creation')} <Link
					href="https://docs.gitbutler.com/features/forge-integration/github-integration">{$t('common.read_more')}</Link
				> {$t('common.in_the')} <Link
					href="https://docs.gitbutler.com/features/forge-integration/github-integration">{$t('common.docs')}</Link
				>
			{/snippet}

			{#if githubAccounts.current.length === 0 || !preferredGitHubAccount.current}
				<!-- TODO: Link to the general settings -->
				<InfoMessage style="warning" filled outlined={false}>
					{#snippet title()}
						{$t('settings.no_github_accounts')}
					{/snippet}
					{#snippet content()}
						{$t('settings.add_github_account_general_settings')}
					{/snippet}
				</InfoMessage>
			{:else}
				{@const account = preferredGitHubAccount.current}
				<Select
					label={$t('settings.github_account_for_project')}
					value={githubAccountIdentifierToString(account)}
					options={githubAccounts.current.map((account) => ({
						label: account.info.username,
						value: githubAccountIdentifierToString(account)
					}))}
					onselect={(value) => {
						const account = stringToGitHubAccountIdentifier(value);
						if (!account) return;
						projectsService.updatePreferredForgeUser(projectId, account);
					}}
					disabled={githubAccounts.current.length <= 1}
					wide
				>
					{#snippet itemSnippet({ item, highlighted })}
						{@const itemAccount = item.value && stringToGitHubAccountIdentifier(item.value)}
						<SelectItem
							selected={item.value === githubAccountIdentifierToString(account)}
							{highlighted}
						>
							{item.label}

							{#if itemAccount}
								<GitHubAccountBadge account={itemAccount} class="m-l-4" />
							{/if}
						</SelectItem>
					{/snippet}
				</Select>
			{/if}
		</CardGroup.Item>
	{/if}
</CardGroup>
