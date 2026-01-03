<script lang="ts" module>
	export type CreateSnapshotModalProps = {
		projectId: string;
	};
</script>

<script lang="ts">
	import { HISTORY_SERVICE } from '$lib/history/history';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { Button, ElementId, Modal, TestId, Textbox } from '@gitbutler/ui';

	const { projectId }: CreateSnapshotModalProps = $props();

	const historyService = inject(HISTORY_SERVICE);

	let message: string = $state('');
	let modal: Modal | undefined = $state();
	let isCreating = $state(false);

	export function show() {
		message = '';
		modal?.show();
	}

	async function createSnapshot(close: () => void) {
		if (isCreating) return;

		try {
			isCreating = true;
			await historyService.createSnapshot(projectId, message || undefined);
			close();
		} catch (error) {
			console.error('Failed to create snapshot:', error);
		} finally {
			isCreating = false;
		}
	}
</script>

<Modal
	testId={TestId.CreateSnapshotModal}
	width="small"
	title={$t('snapshots.create_snapshot')}
	type="info"
	bind:this={modal}
	onSubmit={createSnapshot}
>
	<Textbox
		placeholder={$t('snapshots.snapshot_description')}
		id={ElementId.SnapshotDescriptionInput}
		bind:value={message}
		autofocus
		helperText={$t('snapshots.snapshot_helper')}
	/>

	{#snippet controls(close)}
		<Button kind="outline" type="reset" onclick={close}>{$t('common.cancel')}</Button>
		<Button
			testId={TestId.CreateSnapshotModal_ActionButton}
			style="pop"
			type="submit"
			loading={isCreating}
		>
			{$t('snapshots.create_snapshot')}
		</Button>
	{/snippet}
</Modal>
