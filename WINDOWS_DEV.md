# GitButler Windows 开发指南 (Visual Studio 2022)

## 📋 前置要求

### 1. 必需软件

- **Visual Studio 2022** (Community/Professional/Enterprise)
- **Node.js** 20.11+ (当前版本: v22.14.0 ✅)
- **Rust** 1.92+ (用于后端编译)
- **Git** (版本控制)
- **pnpm** 10.20.0 (包管理器)

### 2. Visual Studio 2022 组件要求

安装 Visual Studio 2022 时，确保包含以下工作负载：

- **使用 C++ 的桌面开发** (Desktop development with C++)
  - MSVC v143 - VS 2022 C++ x64/x86 生成工具
  - Windows 11 SDK（或 Windows 10 SDK）

### 3. Rust 支持

Visual Studio 2022 本身不完全支持 Rust，但可以调试 Rust 程序。需要安装：


1. **Rust 工具链**:

   ```powershell
   # 安装 Rustup
   # 下载: https://rustup.rs/
   # 或使用
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
2. **Rust Analyzer** (在 VS Code 中使用，或在 VS 2022 中通过扩展支持)

## 🚀 快速开始k

### 步骤 1: 启用 pnpm

打开 **x64 Native Tools Command Prompt for VS 2022**（确保使用 x64 工具集）：

```cmd
corepack enable
corepack prepare pnpm@10.20.0 --activate
```

验证安装：

```cmd
pnpm --version
```

### 步骤 2: 安装项目依赖

```cmd
cd D:\Git\gitbutler
pnpm install
```

### 步骤 3: 构建 Rust 后端（首次必须）

```cmd
cargo build
```

**⚠️ Windows 特别注意：**

首次编译 Rust 可能会遇到 OpenSSL 相关问题。如果遇到：


1. 安装 **Strawberry Perl**：
   - 下载：https://strawberryperl.com/
   - 或使用 Scoop: `scoop install perl`
2. 设置环境变量（在 cmd 中）：

   ```cmd
   set OPENSSL_SRC_PERL=c:\Strawberry\perl\bin\perl.exe
   ```

   或在 PowerShell 中：

   ```powershell
   $env:OPENSSL_SRC_PERL="c:\Strawberry\perl\bin\perl.exe"
   ```

### 步骤 4: 运行开发服务器

```cmd
pnpm dev:desktop
```

这会：


1. 编译 Rust 后端
2. 启动 Vite 开发服务器
3. 打开 GitButler 应用窗口

## 🔧 在 Visual Studio 2022 中调试

### 方法 1: 调试 Rust 后端代码

Visual Studio 2022 可以通过附加到进程来调试 Rust 程序。

#### 步骤：


1. **先启动应用**：

   ```cmd
   pnpm dev:desktop
   ```
2. **在 Visual Studio 2022 中**：
   - 菜单：`Debug` → `Attach to Process...` (调试 → 附加到进程)
   - 找到 `gitbutler-tauri.exe` 或相关进程
   - 点击 `Attach` (附加)
3. **设置断点**：
   - 在 `crates/` 目录下的 Rust 文件中设置断点
   - 触发相应功能，断点会命中

### 方法 2: 使用 Rust Analyzer + VS Code（推荐）

对于 Rust 代码，更推荐使用 VS Code + rust-analyzer 扩展，它提供更好的 Rust 支持。


1. 安装 **VS Code**
2. 安装 **rust-analyzer** 扩展
3. 在 VS Code 中打开项目
4. 直接调试 Rust 代码

### 方法 3: 使用 LLDB 命令行调试

```cmd
# 安装 LLDB
rustup component add lldb

# 调试
lldb target/debug/gitbutler-tauri
```

## 🎯 调试前端代码（Svelte/TypeScript）

前端调试建议使用 **VS Code** 或浏览器 DevTools：

### 使用 VS Code 调试前端


1. 打开 VS Code
2. 按 `F5` 或使用 `.vscode/launch.json` 中配置的 "Dev: Desktop App"
3. 在 `.svelte` 或 `.ts` 文件中设置断点

### 使用浏览器 DevTools

在运行的应用窗口中：

- 按 `F12` 打开开发者工具
- 查看 Console、Network、Elements 等

## 📝 构建配置

### Visual Studio 项目文件

虽然 GitButler 主要使用 Cargo 和 pnpm，但你可以创建 Visual Studio 项目文件：


1. 打开 **Visual Studio 2022**
2. `Open a local folder` (打开本地文件夹)
3. 选择 `D:\Git\gitbutler`
4. Visual Studio 会识别 Cargo 项目

### 调试配置

在 Visual Studio 中，可以创建 `.vs/launchSettings.json`：

```json
{
  "profiles": {
    "GitButler Desktop": {
      "commandName": "Executable",
      "executablePath": "C:\\Users\\YourUsername\\.cargo\\bin\\cargo.exe",
      "commandLineArgs": "run --package gitbutler-tauri",
      "workingDirectory": "D:\\Git\\gitbutler",
      "environmentVariables": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## 📚 常用开发命令

### 在 Developer Command Prompt 中运行

```cmd
:: 构建项目
pnpm build

:: 运行开发服务器
pnpm dev:desktop

:: 带调试日志运行
set LOG_LEVEL=debug
pnpm dev:desktop

:: 运行测试
pnpm test

:: Rust 测试
cargo test

:: 代码检查
pnpm isgood

:: 自动修复
pnpm begood
```

### 仅构建 Rust 部分

```cmd
:: 构建所有 Rust crates
cargo build

:: 构建 release 版本
cargo build --release

:: 构建特定 crate
cargo build -p but
cargo build -p gitbutler-tauri
```

## 🐛 调试技巧

### 查看 Rust 日志

```cmd
set RUST_LOG=debug
pnpm dev:desktop
```

### 性能分析

```cmd
set GITBUTLER_PERFORMANCE_LOG=1
pnpm dev:desktop
```

### 查看 Tokio 运行时

项目集成了 tokio-console 支持：

```cmd
# 安装 tokio-console
cargo install tokio-console

# 在另一个终端运行
tokio-console
```

## ⚠️ 常见问题

### 1. C++ 编译器未找到

**问题：** `error: linker `link.exe` not found`

**解决：**

- 打开 **x64 Native Tools Command Prompt for VS 2022**
- 在这个命令提示符中运行构建命令

### 2. OpenSSL 编译错误

**问题：** `openssl-sys` 编译失败

**解决：**


1. 安装 Strawberry Perl：https://strawberryperl.com/
2. 设置环境变量：

   ```cmd
   set OPENSSL_SRC_PERL=c:\Strawberry\perl\bin\perl.exe
   ```

### 3. Cargo 找不到

**问题：** `cargo: command not found`

**解决：**

- 确保 Rust 已安装：`%USERPROFILE%\.cargo\bin` 应该在 PATH 中
- 重启命令提示符使环境变量生效

### 4. pnpm 未找到

**解决：**

```cmd
corepack enable
corepack prepare pnpm@10.20.0 --activate
```

### 5. 构建缓存问题

```cmd
:: 清除 Turbo 缓存
pnpm exec turbo daemon stop
pnpm exec turbo daemon clean

:: 清除 Rust 构建缓存
cargo clean

:: 完全重置
rd /s /q .turbo node_modules target
pnpm install
cargo build
```

## 🎯 推荐开发工作流

### 混合使用 Visual Studio 2022 和 VS Code

由于 GitButler 是 Tauri 应用（Rust + Svelte），推荐：


1. **Visual Studio 2022**：
   - 调试 Rust 后端代码
   - 查看和分析 C++/Rust 性能
   - 使用 Visual Studio 的强大调试功能
2. **VS Code**：
   - 开发前端 Svelte/TypeScript 代码
   - 日常编辑和快速调试
   - 利用 rust-analyzer 的 Rust 支持
3. **命令行**：
   - 运行 `pnpm dev:desktop` 启动应用
   - 运行测试和构建命令

### 典型工作流程

```cmd
:: 1. 打开 x64 Native Tools Command Prompt for VS 2022

:: 2. 进入项目目录
cd D:\Git\gitbutler

:: 3. 启动应用
pnpm dev:desktop

:: 4. 在 Visual Studio 2022 中附加到进程进行调试

:: 5. 在 VS Code 中编辑前端代码（自动热重载）
```

## 📚 资源

- **项目文档**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Tauri 文档**: https://tauri.app/v1/guides/
- **Rust Book**: https://doc.rust-lang.org/book/
- **Svelte 文档**: https://svelte.dev/docs
- **GitHub Issues**: https://github.com/gitbutlerapp/gitbutler/issues
- **Discord**: https://discord.gg/MmFkmaJ42D

## 🚀 下一步

现在你已经准备好了！可以开始：


1. 运行 `pnpm dev:desktop` 启动应用
2. 开始添加国际化支持（svelte-i18n）
3. 翻译界面文本为中文

祝开发愉快！🎉