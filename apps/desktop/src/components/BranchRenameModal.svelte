<script lang="ts" module>
	export type BranchRenameModalProps = {
		projectId: string;
		stackId?: string;
		laneId: string;
		branchName: string;
		isPushed: boolean;
	};
</script>

<script lang="ts">
	import BranchNameTextbox from '$components/BranchNameTextbox.svelte';
	import { STACK_SERVICE } from '$lib/stacks/stackService.svelte';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { Button, ElementId, Modal, TestId } from '@gitbutler/ui';

	const { projectId, stackId, laneId, branchName, isPushed }: BranchRenameModalProps = $props();
	const stackService = inject(STACK_SERVICE);

	const [renameBranch, renameQuery] = stackService.updateBranchName;

	let newName: string | undefined = $state();
	let slugifiedRefName: string | undefined = $state();
	let modal: Modal | undefined = $state();

	let branchNameInput = $state<ReturnType<typeof BranchNameTextbox>>();

	export async function show() {
		newName = branchName;
		modal?.show();
		// Select text after async value is set
		await branchNameInput?.selectAll();
	}
</script>

<Modal
	testId={TestId.BranchHeaderRenameModal}
	width="small"
	title={isPushed ? $t('branches.branch_already_pushed') : $t('branches.rename_branch')}
	type={isPushed ? 'warning' : 'info'}
	bind:this={modal}
	onSubmit={async (close) => {
		if (slugifiedRefName) {
			renameBranch({ projectId, stackId, laneId, branchName, newName: slugifiedRefName });
		}
		close();
	}}
>
	<BranchNameTextbox
		bind:this={branchNameInput}
		placeholder={$t('branches.new_name')}
		id={ElementId.NewBranchNameInput}
		bind:value={newName}
		autofocus
		onslugifiedvalue={(value) => (slugifiedRefName = value)}
	/>

	{#if isPushed}
		<div class="text-12 helper-text">
			{$t('branches.rename_warning')}
		</div>
	{/if}

	{#snippet controls(close)}
		<Button kind="outline" type="reset" onclick={close}>{$t('common.cancel')}</Button>
		<Button
			testId={TestId.BranchHeaderRenameModal_ActionButton}
			style="pop"
			type="submit"
			disabled={!slugifiedRefName}
			loading={renameQuery.current.isLoading}>{$t('branches.rename')}</Button
		>
	{/snippet}
</Modal>

<style lang="postcss">
	.helper-text {
		margin-top: 1rem;
		color: var(--clr-text-2);
		line-height: 1.5;
	}
</style>
