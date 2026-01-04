<script lang="ts">
	import AiPromptSelect from '$components/AIPromptSelect.svelte';
	import SettingsSection from '$components/SettingsSection.svelte';
	import WelcomeSigninAction from '$components/WelcomeSigninAction.svelte';
	import { projectAiExperimentalFeaturesEnabled, projectAiGenEnabled } from '$lib/config/config';
	import { useSettingsModal } from '$lib/settings/settingsModal.svelte';
	import { t } from '$lib/i18n/i18n';
	import { USER_SERVICE } from '$lib/user/userService';
	import { inject } from '@gitbutler/core/context';
	import { Button, CardGroup, Spacer, Toggle } from '@gitbutler/ui';

	const { projectId }: { projectId: string } = $props();

	const userService = inject(USER_SERVICE);
	const user = userService.user;
	const { openGeneralSettings } = useSettingsModal();

	const aiGenEnabled = $derived(projectAiGenEnabled(projectId));
	const experimentalAiGenEnabled = $derived(projectAiExperimentalFeaturesEnabled(projectId));
</script>

<SettingsSection>
	{#snippet description()}
		{$t('ai.ai_support_description')}
	{/snippet}

	<Spacer />

	{#if !$user}
		<WelcomeSigninAction />
		<Spacer />
	{/if}

	<CardGroup>
		<CardGroup.Item labelFor="aiGenEnabled">
			{#snippet title()}
				{$t('ai.enable_branch_commit_generation')}
			{/snippet}
			{#snippet caption()}
				{$t('ai.enable_branch_commit_generation_description')}
			{/snippet}
			{#snippet actions()}
				<Toggle
					id="aiGenEnabled"
					checked={$aiGenEnabled}
					onclick={() => {
						$aiGenEnabled = !$aiGenEnabled;
					}}
				/>
			{/snippet}
		</CardGroup.Item>
	</CardGroup>

	{#if $aiGenEnabled}
		<CardGroup>
			<CardGroup.Item labelFor="aiExperimental">
				{#snippet title()}
					{$t('ai.enable_experimental_ai')}
				{/snippet}
				{#snippet caption()}
					{$t('ai.enable_experimental_ai_description')}
				{/snippet}
				{#snippet actions()}
					<Toggle
						id="aiExperimental"
						checked={$experimentalAiGenEnabled}
						onclick={() => {
							$experimentalAiGenEnabled = !$experimentalAiGenEnabled;
						}}
					/>
				{/snippet}
			</CardGroup.Item>
		</CardGroup>
	{/if}

	<CardGroup>
		<CardGroup.Item>
			{#snippet title()}
				{$t('ai.custom_prompts')}
			{/snippet}

			<AiPromptSelect {projectId} promptUse="commits" />
			<AiPromptSelect {projectId} promptUse="branches" />

			<Spacer margin={8} />

			<p class="text-12 text-body">
				{$t('ai.custom_prompts_description')}
			</p>
			<Button kind="outline" icon="edit" onclick={() => openGeneralSettings('ai')}
				>{$t('ai.customize_prompts')}</Button
			>
		</CardGroup.Item>
	</CardGroup>
</SettingsSection>
