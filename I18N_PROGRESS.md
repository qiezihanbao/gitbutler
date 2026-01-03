# GitButler 中文汉化进度

## ✅ 已完成的工作

### 1. i18n 基础架构 (100%)

- [x] 安装和配置 `svelte-i18n`
- [x] 创建 i18n 配置文件 (`apps/desktop/src/lib/i18n/i18n.ts`)
- [x] 在应用入口初始化 i18n (`apps/desktop/src/hooks.client.ts`)
- [x] 实现语言服务 (`apps/desktop/src/lib/i18n/languageService.ts`)

### 2. 翻译文件 (基础完成)

**位置**: `apps/desktop/src/lib/i18n/locales/`

- [x] `en.json` - 英文翻译（包含基础翻译键）
- [x] `zh.json` - 中文翻译（对应英文的所有键）

**当前翻译类别**:
- `common` - 通用文本（按钮、操作等）
- `app` - 应用基本信息
- `navigation` - 导航菜单
- `branches` - 分支相关
- `commits` - 提交相关
- `files` - 文件相关
- `settings` - 设置相关
- `workspace` - 工作区相关

### 3. 语言切换功能 (100%)

- [x] `LanguageSelector.svelte` - 下拉选择器组件
- [x] `SwitchLanguageMenuAction.svelte` - 快捷键切换组件
- [x] `languageService.ts` - 语言管理服务
- [x] localStorage 持久化语言偏好
- [x] 自动检测浏览器语言

### 4. 文档和示例 (100%)

- [x] `apps/desktop/src/lib/i18n/README.md` - 完整的使用文档
- [x] `I18nDemo.svelte` - 演示组件，展示如何使用 i18n

## 🚧 待完成的工作

### 1. 扩展翻译文件 (进行中)

需要在 `en.json` 和 `zh.json` 中添加更多翻译键：

**优先级高的区域**:
- [ ] 错误提示和警告信息
- [ ] 表单验证消息
- [ ] 对话框文本
- [ ] 工具提示 (tooltips)
- [ ] 上下文菜单项
- [ ] 快捷键说明

**优先级中的区域**:
- [ ] 设置页面的所有选项
- [ ] 分支操作的详细说明
- [ ] 提交历史的显示文本
- [ ] 文件差异视图
- [ ] 合并冲突界面
- [ ] Git 操作进度提示

**优先级低的区域**:
- [ ] 帮助文档
- [ ] 关于页面
- [ ] 日志和调试信息
- [ ] 开发者工具相关

### 2. 在组件中应用翻译 (大量工作)

需要逐个组件替换硬编码文本：

**主要组件列表**:
```
apps/desktop/src/components/
├── ChromeSidebar.svelte          # 侧边栏导航
├── ChromeHeader.svelte           # 顶部标题栏
├── BranchHeader.svelte           # 分支头部
├── CommitTitle.svelte            # 提交标题
├── FileListItemWrapper.svelte    # 文件列表项
├── SettingsModalLayout.svelte    # 设置模态框
└── ... (更多组件)
```

**替换步骤**:
1. 识别组件中的硬编码文本
2. 在翻译文件中添加对应的键
3. 导入 i18n: `import { _ } from '$lib/i18n/i18n';`
4. 替换文本: `'Hardcoded'` → `_('translation.key')`
5. 测试语言切换功能

### 3. 集成到设置页面

将语言选择器集成到设置页面，让用户可以在设置中切换语言。

**建议位置**: 设置 → 通用 → 语言

### 4. 测试和验证

- [ ] 测试所有语言切换场景
- [ ] 验证翻译的准确性和一致性
- [ ] 检查文本截断和布局问题
- [ ] 确保所有用户可见的文本都已翻译

## 📋 使用指南

### 在新组件中使用 i18n

```svelte
<script lang="ts">
	import { _ } from '$lib/i18n/i18n';
</script>

<button>{_('common.save')}</button>
<button>{_('common.cancel')}</button>
```

### 添加新的翻译

1. 在 `apps/desktop/src/lib/i18n/locales/en.json` 添加英文:
```json
{
  "my_feature": {
    "title": "My Feature",
    "action": "Do Something"
  }
}
```

2. 在 `apps/desktop/src/lib/i18n/locales/zh.json` 添加中文:
```json
{
  "my_feature": {
    "title": "我的功能",
    "action": "执行操作"
  }
}
```

3. 在组件中使用:
```svelte
<h2>{_('my_feature.title')}</h2>
<button>{_('my_feature.action')}</button>
```

## 🔧 开发工具

### 查看演示组件

在开发环境中可以查看 `I18nDemo.svelte` 组件，它展示了：
- 如何使用翻译
- 如何切换语言
- 现有的翻译示例

### 快速切换语言测试

```typescript
import { setLocale } from '$lib/i18n/languageService';

// 切换到中文
setLocale('zh');

// 切换到英文
setLocale('en');
```

## 📊 翻译进度统计

| 类别 | 状态 | 完成度 |
|------|------|--------|
| 基础架构 | ✅ 完成 | 100% |
| 通用文本 | ✅ 完成 | 100% |
| 导航菜单 | ✅ 完成 | 100% |
| 分支相关 | ✅ 完成 | 100% |
| 提交相关 | ✅ 完成 | 100% |
| 文件相关 | ✅ 完成 | 100% |
| 设置相关 | ✅ 完成 | 100% |
| 工作区相关 | ✅ 完成 | 100% |
| 错误提示 | ⏳ 待开始 | 0% |
| 表单验证 | ⏳ 待开始 | 0% |
| 对话框 | ⏳ 待开始 | 0% |
| 工具提示 | ⏳ 待开始 | 0% |
| 组件应用 | ⏳ 进行中 | ~5% |

## 🎯 下一步行动

1. **立即执行**:
   - 在常用组件中应用 i18n（如侧边栏、标题栏）
   - 添加错误提示的翻译
   - 集成语言选择器到设置页面

2. **短期计划**:
   - 完成所有主要界面的翻译应用
   - 添加更多翻译键
   - 进行全面的翻译测试

3. **长期计划**:
   - 支持更多语言（如果需要）
   - 添加翻译覆盖率检查工具
   - 建立翻译更新流程

## 📝 注意事项

1. **保持键名一致**: en.json 和 zh.json 必须有相同的键结构
2. **回退机制**: 缺失的翻译会自动回退到英文
3. **性能考虑**: 翻译文件按需加载，首次切换可能有短暂延迟
4. **布局适配**: 中文文本可能比英文长，需要测试布局
5. **专业性**: 确保 Git 术语的翻译准确性和一致性

## 🔗 相关文件

- `apps/desktop/src/lib/i18n/README.md` - 详细使用文档
- `apps/desktop/src/lib/i18n/i18n.ts` - i18n 配置
- `apps/desktop/src/lib/i18n/languageService.ts` - 语言服务
- `apps/desktop/src/lib/i18n/locales/en.json` - 英文翻译
- `apps/desktop/src/lib/i18n/locales/zh.json` - 中文翻译
- `apps/desktop/src/components/LanguageSelector.svelte` - 语言选择器
- `apps/desktop/src/components/I18nDemo.svelte` - 演示组件

---

**更新日期**: 2026-01-04
**维护者**: GitButler 开发团队
