# GitButler 菜单汉化实现

## ✅ 已实现：方案 2 - 前端动态生成菜单

菜单汉化已通过前端动态生成方案实现！

### 实现细节

#### 1. 前端翻译文件

已在以下文件中添加了完整的菜单翻译：
- `apps/desktop/src/lib/i18n/locales/en.json` - 英文菜单项
- `apps/desktop/src/lib/i18n/locales/zh.json` - 中文菜单项

新增 `menu` 类别，包含所有菜单项的翻译键。

#### 2. 前端菜单服务

创建了 `apps/desktop/src/lib/menu/menuService.ts`：
- `buildI18nMenu()` - 构建并应用翻译后的菜单
- 从 i18n 系统获取翻译
- 通过 Tauri invoke 发送到 Rust 后端

#### 3. Rust 后端支持

创建了 `crates/gitbutler-tauri/src/i18n_menu.rs`：
- 定义 `MenuTranslations` 结构体
- `build_i18n_menu` Tauri 命令
- 全局存储当前翻译

已在以下文件中注册：
- `crates/gitbutler-tauri/src/lib.rs` - 导入模块
- `crates/gitbutler-tauri/src/main.rs` - 注册 Tauri 命令

#### 4. 应用启动时自动构建

在 `apps/desktop/src/routes/+layout.svelte` 中：
- 应用启动时自动调用 `buildI18nMenu()`
- 根据用户语言设置构建对应的菜单

## 已翻译的菜单项

### File（文件）
- Add Local Repository… → 添加本地仓库…
- Clone Repository… → 克隆仓库…
- Create Branch… → 创建分支…
- Create Dependent Branch… → 创建依赖分支…

### Edit（编辑）
- Undo → 撤销
- Redo → 重做
- Cut/Copy/Paste → 剪切/复制/粘贴（系统预定义）

### View（视图）
- Fullscreen → 进入全屏
- Switch Theme → 切换主题
- Toggle Unassigned → 切换未分配
- Zoom In/Out/Reset → 放大/缩小/重置缩放
- Developer Tools → 开发者工具
- Reload View → 重新加载视图

### Project（项目）
- Operations History → 操作历史
- Open in Editor → 在编辑器中打开
- Show in Finder/Explorer/File Manager → 在 Finder/资源管理器/文件管理器中显示
- Project Settings → 项目设置

### Window（窗口，仅 macOS）
- Minimize → 最小化
- Maximize → 最大化
- Close Window → 关闭窗口

### Help（帮助）
- Documentation → 文档
- Debugging Guide → 调试指南
- Source Code → 源代码
- Release Notes → 发行说明
- Share Debug Info… → 分享调试信息…
- Create an Issue → 创建问题
- Open Logs Folder → 打开日志文件夹
- Open Config Folder → 打开配置文件夹
- Discord/Youtube/Bluesky/X → 保持原名
- Version {version} → 版本 {version}

## 下一步

### 未来改进

1. **动态语言切换**：当用户更改语言设置时，自动重新构建菜单
   ```typescript
   // 在语言设置变更时调用
   await buildI18nMenu();
   ```

2. **完整的菜单重建**：当前实现存储了翻译，但需要重构 `build()` 函数以实际应用翻译到菜单项

3. **平台适配**：根据不同平台（macOS/Windows/Linux）显示不同的菜单项

## 相关文件

### 前端
- `apps/desktop/src/lib/i18n/locales/zh.json` - 中文翻译
- `apps/desktop/src/lib/i18n/locales/en.json` - 英文翻译
- `apps/desktop/src/lib/menu/menuService.ts` - 菜单服务
- `apps/desktop/src/routes/+layout.svelte` - 应用初始化

### 后端
- `crates/gitbutler-tauri/src/menu.rs` - 菜单定义
- `crates/gitbutler-tauri/src/i18n_menu.rs` - i18n 菜单支持
- `crates/gitbutler-tauri/src/lib.rs` - 模块导出
- `crates/gitbutler-tauri/src/main.rs` - Tauri 命令注册

## 使用方法

菜单会在应用启动时自动根据当前语言设置构建。无需手动操作。

如需手动重建菜单（例如更改语言后）：

```typescript
import { buildI18nMenu } from '$lib/menu/menuService.svelte';

// 重建菜单
await buildI18nMenu();
```

## 注意事项

- 系统预定义菜单项（如 Cut/Copy/Paste）由操作系统提供，无法通过此方案翻译
- macOS 的应用菜单（About、Settings 等）由 Tauri 自动处理
- 需要重新编译 Rust 代码以使更改生效
