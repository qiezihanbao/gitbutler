# i18n 修复报告

## 问题

错误信息：`Uncaught TypeError: _ is not a function`

## 原因

在 Svelte 5 中，`svelte-i18n` 的使用方式与 Svelte 4 不同：
- ❌ **错误**: `import { _ } from '$lib/i18n/i18n';` 然后 `_('key')`
- ✅ **正确**: `import { t } from '$lib/i18n/i18n';` 然后 `$t('key')`

## 修复方案

### 已修复的文件

1. **Welcome.svelte** ✅
   - 改为使用 `import { t }`
   - 所有翻译调用改为 `$t('key')`

2. **GeneralSettingsModalContent.svelte** ✅
   - 改为使用 `import { t }`
   - 所有翻译调用改为 `$t('key')`

3. **ChromeSidebar.svelte** ✅
   - 改为使用 `import { t }`
   - 所有翻译调用改为 `$t('key')`

### 正确的用法示例

```svelte
<script lang="ts">
	import { t } from '$lib/i18n/i18n';
	// 不要 import { _ }
</script>

<h1>{$t('app.name')}</h1>
<button>{$t('common.save')}</button>
```

### 为什么使用 $t？

在 Svelte 5 中：
- `$t` 是一个 store，使用 `$` 前缀自动订阅
- 当语言改变时，所有使用 `$t` 的地方会自动更新
- `_` 函数在 Svelte 5 中不可用或工作方式不同

## 测试

1. 启动应用：`pnpm dev:desktop`
2. 检查欢迎界面是否正常显示
3. 尝试切换语言：
   ```javascript
   localStorage.setItem('gitbutler-locale', 'zh')
   // 刷新页面
   ```

## 已更新文档

- `apps/desktop/src/lib/i18n/README.md` - 更新为正确的用法
- 所有示例代码现在使用 `$t` 而不是 `_`

## 总结

✅ 问题已解决
✅ 所有组件已修复
✅ 文档已更新

现在可以正常使用中文汉化功能了！
