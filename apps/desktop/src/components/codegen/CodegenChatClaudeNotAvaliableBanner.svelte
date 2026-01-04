<script lang="ts">
	import { Icon, Button } from '@gitbutler/ui';
	import { t } from '$lib/i18n/i18n';

	interface Props {
		onSettingsBtnClick: () => void;
	}

	const { onSettingsBtnClick }: Props = $props();
</script>

<div class="not-available-banner__wrapper">
	<div class="not-available-banner">
		<div class="not-available-banner__content">
			<h3 class="text-16 text-semibold">
				<span class="not-available-banner__icon">
					<Icon name="warning" />
				</span> {$t('codegen.claude_code_not_found')}
			</h3>
			<p class="text-13 text-body clr-text-2">
				{$t('codegen.connect_claude_code_to_continue')}
			</p>
		</div>
		<Button style="gray" icon="mixer" type="button" reversedDirection onclick={onSettingsBtnClick}
			>{$t('codegen.setup_connection')}</Button
		>
	</div>
</div>

<style lang="postcss">
	.not-available-banner__wrapper {
		display: flex;
		z-index: var(--z-ground);
		position: absolute;
		bottom: 0;
		left: 0;
		justify-content: center;
		width: 100%;
		padding: 14px;
	}
	.not-available-banner {
		display: flex;
		bottom: 16px;
		flex-direction: column;
		width: fit-content;
		padding: 16px;
		overflow: hidden;
		gap: 16px;
		border: 1px solid var(--clr-border-2);
		border-radius: var(--radius-ml);
		background-color: var(--clr-bg-1);
		box-shadow: var(--fx-shadow-l);
	}

	.not-available-banner__content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.not-available-banner__icon {
		display: inline-flex;
		margin-right: 2px;
		transform: translateY(2px);
		color: var(--clr-theme-warn-element);
	}
</style>
