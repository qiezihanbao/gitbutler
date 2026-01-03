<script lang="ts" module>
	export type DeleteBranchModalProps = {
		projectId: string;
		stackId?: string;
		branchName: string;
	};
</script>

<script lang="ts">
	import { STACK_SERVICE } from '$lib/stacks/stackService.svelte';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { Button, Modal, TestId } from '@gitbutler/ui';

	const { projectId, stackId, branchName }: DeleteBranchModalProps = $props();
	const stackService = inject(STACK_SERVICE);
	const [removeBranch, branchRemovalOp] = stackService.removeBranch;

	let modal = $state<Modal>();

	export function show() {
		modal?.show();
	}
</script>

<Modal
	testId={TestId.BranchHeaderDeleteModal}
	bind:this={modal}
	width="small"
	title={$t('branches.delete_branch_title')}
	onSubmit={async (close) => {
		await removeBranch({
			projectId,
			stackId,
			branchName
		});
		close();
	}}
>
	<p class="text-13 text-body">
		{@html $t('branches.delete_branch_with_name', { values: { branchName } })}
	</p>
	{#snippet controls(close)}
		<Button kind="outline" onclick={close} autofocus>{$t('common.cancel')}</Button>
		<Button
			testId={TestId.BranchHeaderDeleteModal_ActionButton}
			style="danger"
			type="submit"
			loading={branchRemovalOp.current.isLoading}>{$t('branches.delete')}</Button
		>
	{/snippet}
</Modal>
