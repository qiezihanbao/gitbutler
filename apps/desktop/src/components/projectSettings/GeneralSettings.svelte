<script lang="ts">
	import BaseBranchSwitch from '$components/BaseBranchSwitch.svelte';
	import DetailsForm from '$components/DetailsForm.svelte';
	import ForgeForm from '$components/ForgeForm.svelte';
	import GerritForm from '$components/GerritForm.svelte';
	import RemoveProjectForm from '$components/RemoveProjectForm.svelte';
	import { projectDisableCodegen } from '$lib/config/config';
	import { t } from '$lib/i18n/i18n';
	import { CardGroup, Spacer, Toggle } from '@gitbutler/ui';

	const { projectId }: { projectId: string } = $props();

	const codegenDisabled = $derived(projectDisableCodegen(projectId));
</script>

<DetailsForm {projectId} />
<BaseBranchSwitch {projectId} />
<GerritForm {projectId} />
<ForgeForm {projectId} />
<!-- Maybe we could inline more settings here -->
<CardGroup.Item standalone labelFor="disable-codegen">
	{#snippet title()}
		{$t('codegen.disable_codegen')}
	{/snippet}
	{#snippet caption()}
		{$t('codegen.disable_codegen_description')}
	{/snippet}
	{#snippet actions()}
		<Toggle
			id="disable-codegen"
			checked={$codegenDisabled}
			onclick={() => ($codegenDisabled = !$codegenDisabled)}
		/>
	{/snippet}
</CardGroup.Item>
<Spacer />
<RemoveProjectForm {projectId} />
