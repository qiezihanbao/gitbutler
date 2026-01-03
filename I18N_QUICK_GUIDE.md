# GitButler 中文汉化快速指南

## 🎉 已完成的工作

### ✅ 核心功能已汉化
1. **i18n 基础架构** - 100%
2. **翻译文件** - 大幅扩展，新增 100+ 翻译键
3. **欢迎界面** - 100%
4. **设置界面** - 100%
5. **侧边栏导航** - 100%
6. **Forge 集成提示** - 100%
7. **创建分支对话框** - 90%

### ✅ 新增翻译类别
- `forge` - GitHub/GitLab 集成提示
- `time` - 时间显示（今天、昨天、X小时前等）
- `stack` - 堆栈相关

## 📋 快速汉化新组件

### 三步汉化法：

#### 第1步：添加翻译
在 `apps/desktop/src/lib/i18n/locales/` 添加翻译：

**en.json:**
```json
{
  "my_component": {
    "title": "My Feature",
    "action": "Do Something"
  }
}
```

**zh.json:**
```json
{
  "my_component": {
    "title": "我的功能",
    "action": "执行操作"
  }
}
```

#### 第2步：导入 i18n
```svelte
<script lang="ts">
	import { t } from '$lib/i18n/i18n';
	// ... 其他代码
</script>
```

#### 第3步：替换文本
```svelte
<!-- 之前 -->
<h1>My Feature</h1>
<button>Do Something</button>

<!-- 之后 -->
<h1>{$t('my_component.title')}</h1>
<button>{$t('my_component.action')}</button>
```

## 🔍 待汉化组件列表

### 高优先级（用户最常看到）：
1. **BranchExplorer.svelte** - 时间显示（Today, Yesterday等）
2. **UnassignedView.svelte** - "Unassigned" 标题
3. **CommitMessageEditor.svelte** - 提交编辑器
4. **NewCommitView.svelte** - 新建提交

### 中优先级（常用功能）：
5. **BranchRenameModal.svelte** - 重命名分支
6. **DeleteBranchModal.svelte** - 删除分支
7. **CloneForm.svelte** - 克隆表单
8. **IntegrationsSettings.svelte** - 集成设置

### 低优先级（较少使用）：
9. 各种错误提示和确认对话框
10. 帮助和文档链接

## 📖 常用翻译参考

### 通用操作：
- Create → 创建
- Delete → 删除
- Edit → 编辑
- Save → 保存
- Cancel → 取消
- Confirm → 确认
- Apply → 应用
- Configure → 配置

### Git 术语：
- Branch → 分支
- Commit → 提交
- Push → 推送
- Pull → 拉取
- Merge → 合并
- Clone → 克隆
- Repository → 仓库
- Remote → 远程

### 状态：
- Unassigned → 未分配
- Unapplied → 未应用
- Staged → 已暂存
- Unstaged → 未暂存
- Untracked → 未跟踪

### 时间：
- Today → 今天
- Yesterday → 昨天
- X hours ago → X 小时前
- X days ago → X 天前
- Just now → 刚刚

## 🧪 测试汉化

### 切换语言
```javascript
// 在浏览器控制台执行：
localStorage.setItem('gitbutler-locale', 'zh')
// 或
localStorage.setItem('gitbutler-locale', 'en')
// 然后刷新页面
```

### 检查清单
- [ ] 文本已翻译
- [ ] 中文和英文长度相近
- [ ] 布局没有破坏
- [ ] 语言切换正常工作
- [ ] 带参数的翻译正确显示

## 📚 现有翻译键速查

### 常用：
- `common.cancel` - 取消
- `common.confirm` - 确认
- `common.save` - 保存
- `common.delete` - 删除
- `common.dismiss` - 忽略
- `common.see_more` - 查看更多
- `common.read_more` - 阅读更多

### 导航：
- `navigation.workspace` - 工作区
- `navigation.branches` - 分支
- `navigation.history` - 历史

### 设置：
- `settings.general` - 通用
- `settings.appearance` - 外观
- `settings.global` - 全局设置
- `settings.project` - 项目设置

### 分支：
- `branches.create` - 创建分支
- `branches.delete` - 删除分支
- `branches.independent` - 独立分支
- `branches.unapplied` - 未应用

### 时间：
- `time.today` - 今天
- `time.yesterday` - 昨天
- `time.up_to_date` - 您已是最新

### Forge：
- `forge.github_remote` - 看起来您有一个 {forge} 远程仓库！
- `forge.can_manage` - GitButler 可以显示、创建和管理{unit}
- `forge.configure_integration` - 配置集成…

## 💡 提示

1. **始终使用 `$t()`**: 不要使用 `_()`
2. **保持简洁**: 中文翻译应简短准确
3. **专业术语**: 使用标准的 Git 术语
4. **测试布局**: 确保翻译后布局正常

## 📝 需要帮助？

查看详细文档：
- `I18N_PHASE2_REPORT.md` - 第二阶段详细报告
- `I18N_COMPLETION_REPORT.md` - 完成报告
- `apps/desktop/src/lib/i18n/README.md` - 使用文档

---

**快速开始**：
1. 打开需要汉化的组件
2. 按照三步法添加翻译
3. 测试语言切换
4. 提交代码

**记住**: 每一个被翻译的组件都让更多用户能够使用 GitButler！🎉
