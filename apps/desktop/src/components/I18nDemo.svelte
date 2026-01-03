<script lang="ts">
	/**
	 * 这是一个演示组件，展示如何在 GitButler 中使用 i18n
	 *
	 * 使用方法：
	 * 1. 导入 i18n 函数：import { _, locale } from '$lib/i18n/i18n';
	 * 2. 在模板中使用翻译：_('key.path')
	 * 3. 使用语言服务切换语言：setLocale('zh' | 'en')
	 */

	import { _, locale } from '$lib/i18n/i18n';
	import {
		setLocale,
		getCurrentLocale,
		getLocaleName,
		getSupportedLocales
	} from '$lib/i18n/languageService';
	import LanguageSelector from './LanguageSelector.svelte';

	let currentLocale = $state(getCurrentLocale());

	// 监听语言变化
	$effect(() => {
		const unsub = locale.subscribe((newLocale) => {
			if (newLocale) {
				currentLocale = newLocale as 'en' | 'zh';
			}
		});
		return unsub;
	});

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newLocale = target.value as 'en' | 'zh';
		setLocale(newLocale);
	}
</script>

<div class="i18n-demo">
	<header>
		<h1>{_('app.name')}</h1>
		<p class="subtitle">{_('app.description')}</p>
	</header>

	<section class="language-controls">
		<h2>{_('settings.language')}</h2>

		<!-- 使用语言选择器组件 -->
		<div class="control-group">
			<label>组件选择器：</label>
			<LanguageSelector />
		</div>

		<!-- 自定义选择器 -->
		<div class="control-group">
			<label for="locale-select">自定义选择器：</label>
			<select id="locale-select" value={currentLocale} onchange={handleLanguageChange}>
				{#each getSupportedLocales() as loc}
					<option value={loc}>{getLocaleName(loc)}</option>
				{/each}
			</select>
		</div>

		<!-- 按钮切换 -->
		<div class="control-group">
			<button onclick={() => setLocale('en')}>English</button>
			<button onclick={() => setLocale('zh')}>中文</button>
		</div>
	</section>

	<section class="examples">
		<h2>翻译示例 / Translation Examples</h2>

		<div class="example-group">
			<h3>{_('common.title', { default: '通用文本 / Common Text' })}</h3>
			<div class="grid">
				<div class="item">
					<span class="label">Save:</span>
					<span class="value">{_('common.save')}</span>
				</div>
				<div class="item">
					<span class="label">Cancel:</span>
					<span class="value">{_('common.cancel')}</span>
				</div>
				<div class="item">
					<span class="label">Delete:</span>
					<span class="value">{_('common.delete')}</span>
				</div>
				<div class="item">
					<span class="label">Edit:</span>
					<span class="value">{_('common.edit')}</span>
				</div>
			</div>
		</div>

		<div class="example-group">
			<h3>{_('navigation.title', { default: '导航 / Navigation' })}</h3>
			<div class="grid">
				<div class="item">
					<span class="label">Workspace:</span>
					<span class="value">{_('navigation.workspace')}</span>
				</div>
				<div class="item">
					<span class="label">Branches:</span>
					<span class="value">{_('navigation.branches')}</span>
				</div>
				<div class="item">
					<span class="label">History:</span>
					<span class="value">{_('navigation.history')}</span>
				</div>
			</div>
		</div>

		<div class="example-group">
			<h3>{_('branches.title')}</h3>
			<div class="grid">
				<div class="item">
					<span class="label">Create:</span>
					<span class="value">{_('branches.create')}</span>
				</div>
				<div class="item">
					<span class="label">Switch:</span>
					<span class="value">{_('branches.switch')}</span>
				</div>
				<div class="item">
					<span class="label">Merge:</span>
					<span class="value">{_('branches.merge')}</span>
				</div>
			</div>
		</div>
	</section>

	<section class="info">
		<h2>使用说明</h2>
		<p>1. 在组件中导入: import {{ '{' }} _, locale {{ '}' }} from '$lib/i18n/i18n';</p>
		<p>2. 在模板中使用: {{ '{' }} _('key.path') {{ '}' }}</p>
		<p>3. 切换语言: setLocale('zh') 或 setLocale('en')</p>
		<p>4. 更多信息请查看: apps/desktop/src/lib/i18n/README.md</p>
	</section>
</div>

<style>
	.i18n-demo {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
	}

	section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--gb-bg-color, #f5f5f5);
		border-radius: 8px;
	}

	section h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.control-group {
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 500;
		min-width: 120px;
	}

	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #f0f0f0;
	}

	.example-group {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
	}

	.example-group h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.5rem;
	}

	.item {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--gb-bg-color, #f9f9f9);
		border-radius: 4px;
	}

	.label {
		font-weight: 500;
		min-width: 80px;
	}

	.value {
		color: #666;
	}

	.info p {
		margin: 0.5rem 0;
		font-family: monospace;
		background: white;
		padding: 0.5rem;
		border-radius: 4px;
	}
</style>
