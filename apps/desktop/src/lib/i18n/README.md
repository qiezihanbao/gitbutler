# GitButler i18n 使用指南

本文档说明如何在 GitButler 应用中使用国际化 (i18n) 功能。

## 目录结构

```
apps/desktop/src/lib/i18n/
├── i18n.ts                    # i18n 配置和初始化
├── languageService.ts         # 语言切换服务
├── locales/
│   ├── en.json               # 英文翻译
│   └── zh.json               # 中文翻译
└── README.md                 # 本文档
```

## 基本用法

### 1. 在 Svelte 5 组件中使用（推荐）

```svelte
<script lang="ts">
	import { t } from '$lib/i18n/i18n';
</script>

<h1>{$t('app.name')}</h1>
<p>{$t('app.welcome')}</p>
```

**重要**: 在 Svelte 5 中，必须使用 `$t` store 语法，而不是 `_` 函数。

### 2. 切换语言

```svelte
<script lang="ts">
	import { locale } from '$lib/i18n/i18n';
	import { setLocale } from '$lib/i18n/languageService';

	function switchToChinese() {
		setLocale('zh');
		// 或直接使用
		locale.set('zh');
	}
</script>

<button onclick={switchToChinese}>中文</button>
```

### 3. 带参数的翻译

在 JSON 中定义：
```json
{
	"greeting": "Hello, {name}!",
	"items_count": "You have {count} items"
}
```

在组件中使用：
```svelte
<script lang="ts">
	import { t } from '$lib/i18n/i18n';

	let name = 'World';
	let count = 5;
</script>

<p>{$_('greeting', { values: { name } })}</p>
<p>{$_('items_count', { values: { count } })}</p>
```

**注意**: 带参数的翻译需要使用 `$_` 而不是 `$t`。

## 语言切换

### 1. 使用语言选择器组件

```svelte
<script lang="ts">
	import LanguageSelector from '$components/LanguageSelector.svelte';
</script>

<LanguageSelector />
```

### 2. 编程式切换

```svelte
<script lang="ts">
	import { locale } from '$lib/i18n/i18n';
	import { setLocale } from '$lib/i18n/languageService';

	function switchToChinese() {
		setLocale('zh');
		// 或直接使用
		locale.set('zh');
	}
</script>

<button onclick={switchToChinese}>中文</button>
```

### 3. 切换语言快捷键

```svelte
<script lang="ts">
	import SwitchLanguageMenuAction from '$components/SwitchLanguageMenuAction.svelte';
</script>

<SwitchLanguageMenuAction />
```

## 添加新的翻译

### 1. 添加到翻译文件

**en.json:**
```json
{
	"my_feature": {
		"title": "My Feature",
		"description": "This is a new feature"
	}
}
```

**zh.json:**
```json
{
	"my_feature": {
		"title": "我的功能",
		"description": "这是一个新功能"
	}
}
```

### 2. 在组件中使用

```svelte
<script lang="ts">
	import { _ } from '$lib/i18n/i18n';
</script>

<h2>{_('my_feature.title')}</h2>
<p>{_('my_feature.description')}</p>
```

## 翻译组织建议

### 按功能模块分组

```json
{
	"common": { ... },
	"navigation": { ... },
	"branches": { ... },
	"commits": { ... },
	"files": { ... },
	"settings": { ... },
	"workspace": { ... },
	"your_feature": {
		"title": "...",
		"action": "...",
		"message": "..."
	}
}
```

### 命名规范

- 使用小写字母和下划线：`my_feature_name`
- 按层级组织：`feature.category.item`
- 保持简洁明了：`save` 而不是 `click_to_save`

## 语言服务 API

### `setLocale(locale: SupportedLocale)`

设置当前语言并保存到 localStorage。

```ts
import { setLocale } from '$lib/i18n/languageService';

setLocale('zh'); // 切换到中文
setLocale('en'); // 切换到英文
```

### `getCurrentLocale(): SupportedLocale`

获取当前语言（同步）。

```ts
import { getCurrentLocale } from '$lib/i18n/languageService';

const currentLocale = getCurrentLocale();
console.log(currentLocale); // 'en' or 'zh'
```

### `toggleLocale(): SupportedLocale`

在英文和中文之间切换。

```ts
import { toggleLocale } from '$lib/i18n/languageService';

const newLocale = toggleLocale();
console.log(newLocale); // 'en' or 'zh'
```

### `getLocaleName(locale: SupportedLocale): string`

获取语言的显示名称。

```ts
import { getLocaleName } from '$lib/i18n/languageService';

getLocaleName('en'); // 'English'
getLocaleName('zh'); // '中文'
```

## 完整示例

### 示例组件

```svelte
<script lang="ts">
	import { _, locale } from '$lib/i18n/i18n';
	import { setLocale, getCurrentLocale } from '$lib/i18n/languageService';

	let currentLocale = $state(getCurrentLocale());

	function switchLanguage() {
		const newLocale = currentLocale === 'en' ? 'zh' : 'en';
		setLocale(newLocale);
		currentLocale = newLocale;
	}
</script>

<nav>
	<h1>{_('app.name')}</h1>
	<ul>
		<li><a href="/workspace">{_('navigation.workspace')}</a></li>
		<li><a href="/branches">{_('navigation.branches')}</a></li>
		<li><a href="/history">{_('navigation.history')}</a></li>
	</ul>
	<button onclick={switchLanguage}>
		{currentLocale === 'en' ? '中文' : 'English'}
	</button>
</nav>
```

## 注意事项

1. **键名一致性**：确保 en.json 和 zh.json 中的键名完全一致
2. **缺失翻译**：如果某个键在当前语言中不存在，会回退到英文
3. **性能考虑**：翻译文件是按需加载的，首次切换语言时可能有短暂延迟
4. **持久化**：用户选择的语言会保存在 localStorage 中
5. **初始语言**：首次访问时会根据浏览器语言自动选择（中文浏览器→中文，其他→英文）

## 下一步

要继续汉化应用，请：

1. 在 `en.json` 和 `zh.json` 中添加更多翻译
2. 在组件中替换硬编码文本
3. 测试语言切换功能
4. 检查翻译质量和准确性

## 相关文件

- `apps/desktop/src/lib/i18n/i18n.ts` - i18n 配置
- `apps/desktop/src/lib/i18n/languageService.ts` - 语言服务
- `apps/desktop/src/lib/i18n/locales/en.json` - 英文翻译
- `apps/desktop/src/lib/i18n/locales/zh.json` - 中文翻译
- `apps/desktop/src/components/LanguageSelector.svelte` - 语言选择器组件
- `apps/desktop/src/components/SwitchLanguageMenuAction.svelte` - 语言切换快捷键组件
