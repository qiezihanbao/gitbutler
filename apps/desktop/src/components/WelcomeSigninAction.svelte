<script lang="ts">
	import signinSvg from '$lib/assets/signin.svg?raw';
	import { USER_SERVICE } from '$lib/user/userService';
	import { t } from '$lib/i18n/i18n';
	import { inject } from '@gitbutler/core/context';
	import { AsyncButton, Button, CardGroup } from '@gitbutler/ui';

	import { writable } from 'svelte/store';

	const aborted = writable(false);
	let cancelClicked = $state(false);
	let showCancel = $state(false);

	const userService = inject(USER_SERVICE);
	const loading = userService.loading;
	const user = userService.user;
</script>

{#if !$user}
	<CardGroup>
		<section class="welcome-signin-action">
			<div class="stack-v gap-8">
				<h3 class="text-18 text-bold">{$t('auth.log_in_or_sign_up')}</h3>
				<p class="text-12 text-body clr-text-2">
					{$t('auth.login_description')}
				</p>

				<div class="flex gap-8 m-t-8">
					{#if !showCancel}
						<Button
							style="pop"
							loading={$loading}
							onclick={async () => {
								$aborted = false;
								cancelClicked = false;
								showCancel = false;

								// Show cancel button after 3 seconds
								setTimeout(() => {
									if ($loading) {
										showCancel = true;
									}
								}, 6000);

								// TODO: Track login calls
								await userService.login(aborted);
							}}
						>{$t('auth.log_in_sign_up_button')}</Button>
					{/if}

					{#if $loading && showCancel}
						<AsyncButton
							icon="spinner"
							kind="outline"
							disabled={cancelClicked}
							action={async () => {
								if (cancelClicked) return;
								cancelClicked = true;
								showCancel = false;
								$aborted = true;
							}}
						>{$t('auth.cancel')}</AsyncButton>
					{/if}

					<Button
						kind="outline"
						icon="copy-small"
						disabled={$loading}
						onclick={async () => {
							$aborted = false;
							cancelClicked = false;
							showCancel = false;

							// Show cancel button after 3 seconds
							setTimeout(() => {
								if ($loading) {
									showCancel = true;
								}
							}, 3000);

							await userService.loginAndCopyLink(aborted);
						}}
					>{$t('auth.copy_login_link')}</Button>
				</div>
			</div>

			<div class="signin-svg">
				{@html signinSvg}
			</div>
		</section>
	</CardGroup>
{/if}

<style class="postcss">
	.welcome-signin-action {
		display: flex;
		flex-direction: row;
		padding: 16px;
		gap: 20px;
	}

	.signin-svg {
		flex-shrink: 0;
		width: 100px;
		height: 70px;
		border-radius: var(--radius-m);
		background-color: var(--clr-art-scene-bg);
	}
</style>
