# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitButler is a Tauri-based desktop application for Git that allows working on multiple branches simultaneously. The app uses virtual branches that sit on top of Git, organizing uncommitted changes before they're committed.

**Tech Stack:**
- Frontend: Svelte + TypeScript (apps/desktop and apps/web)
- Backend: Rust (crates/ directory)
- Desktop Framework: Tauri v2
- Build: Turborepo + pnpm workspace
- Git Libraries: gix (gitoxide) and git2 (libgit2)

## Quick Start

### Prerequisites
- **Rust**: 1.92 (defined in rust-toolchain.toml)
- **Node.js**: 20.11+ (use version from .nvmrc: `lts/jod` = Node 22)
- **pnpm**: 10.20.0 (enabled via corepack)

```bash
# Enable pnpm via corepack
corepack enable

# Install dependencies
pnpm install

# Build Rust binaries (required before running)
cargo build

# Run desktop app in development mode
pnpm dev:desktop

# Run with debug logs
LOG_LEVEL=debug pnpm dev:desktop
```

### Build Commands

```bash
# Build all packages
pnpm build

# Build desktop app only
pnpm build:desktop

# Build production release (nightly-style)
pnpm tauri build --features devtools --config crates/gitbutler-tauri/tauri.conf.nightly.json
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests with Playwright
pnpm test:e2e:playwright

# Run Rust tests
cargo test

# Run specific crate tests
cargo test -p gitbutler-branch-actions

# Run but CLI tests (auto-update snapshots with SNAPSHOTS=overwrite)
cargo test -p but
```

## Linting and Formatting

### JavaScript/TypeScript

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm fix

# Format code
pnpm format

# Check formatting
pnpm prettier --check .

# Run all checks (pre-commit verification)
pnpm isgood

# Fix and format everything
pnpm begood
```

**ESLint Rules:**
- No relative imports (use `@gitbutler/` package references)
- Import order: alphabetically sorted with specific group ordering (index, sibling, parent, internal, external, builtin, object, type)
- No console.log (use console.warn or console.error)
- Prefer function declarations over arrow functions at top level
- Svelte-specific: button types, unused props, no-at-html-tags, no-at-debug-tags

**Prettier Config:**
- Tabs for indentation
- Single quotes
- No trailing commas
- 100 character line width

### Rust

```bash
# Format Rust code (use nightly for import grouping)
cargo fmt
# or
pnpm rustfmt  # uses cargo +nightly fmt with rustfmt-nightly.toml

# Run clippy for linting
cargo clippy --all-targets

# Format with nightly settings manually
cargo +nightly fmt -- --config-path rustfmt-nightly.toml
```

**Rust Formatting:**
- Group imports: Std, External, Crate (defined in rustfmt-nightly.toml)
- Imports granularity: Crate level

## Architecture

### Monorepo Structure

**apps/** - Main applications
- `desktop` - Tauri desktop app frontend
- `web` - Web application frontend

**packages/** - Shared npm packages
- `ui` - Shared UI components (Svelte)
- `shared` - Shared types and utilities
- `no-relative-imports` - ESLint rule for enforcing absolute imports
- `core` - Core utilities
- `svelte-comment-injector` - Svelte comment injection tool

**crates/** - Rust workspace (~65 crates)

### Crate Organization

The Rust crates are organized by purpose:

**Modern `but-*` crates** (prefer these):
- `but-core` - Core functionality
- `but-workspace` - Workspace management
- `but-ctx` - Context management
- `but-api` / `but-api-macros` - API layer
- `but-rebase` - Rebase operations
- `but-cherry-apply` - Cherry-pick operations
- `but-graph` - Graph operations
- `but-hunk-assignment` - Assigning hunks to branches
- `but-hunk-dependency` - Hunk dependency tracking
- `but-github` - GitHub integration
- `but-gerrit` - Gerrit integration
- `but-forge` - Forge abstraction (GitHub, Gerrit, etc.)
- `but-settings` - Settings management
- `but-tools` - CLI tools
- `but-rules` - Git rules
- `but-action` - Action system
- `but-claude` - AI/LLM integration
- `but-cursor` - Cursor operations
- `but-worktrees` - Git worktree support

**Legacy `gitbutler-*` crates** (being refactored):
- `gitbutler-branch` - Virtual branches
- `gitbutler-branch-actions` - Branch actions (contains non-branch logic too)
- `gitbutler-reference` - Git references (marked for removal)
- `gitbutler-commit` - Commit operations
- `gitbutler-diff` - Diff operations
- `gitbutler-url` - URL handling (marked for removal)
- `gitbutler-oplog` - Operation log
- `gitbutler-project` - Project management
- `gitbutler-repo` / `gitbutler-repo-actions` - Repository operations
- `gitbutler-user` - User management
- `gitbutler-workspace` - Workspace state
- `gitbutler-git` - Git operations wrapper around git2/gix
- `gitbutler-watcher` / `gitbutler-filemonitor` - File watching
- `gitbutler-sync` - Sync operations
- `gitbutler-tauri` - Tauri backend

**Key Architectural Patterns:**
- Virtual branches are a layer on top of Git that track uncommitted changes
- The app maintains workspace state in a TOML file
- An operation log (`but-oplog`, `gitbutler-oplog`) tracks all operations for undo/redo
- The CLI (`but`) provides both legacy and new APIs

### Code Hitlist (Crates Marked for Refactoring)

Be cautious when modifying these crates:
- `gitbutler-reference` - needs redesign
- `gitbutler-branch-actions` - contains non-branch domain logic
- `gitbutler-branch` - has cyclic dependency issues
- `gitbutler-url` - large mess, ideally eliminated
- `gitbutler_repo::config` - wrong abstraction

### but CLI Guidelines

When working with the `but` CLI:

**API Usage:**
- Prefer code from `but-*` crates over `gitbutler-*` crates
- Avoid legacy code when possible

**Output:**
```rust
// For humans
if let Some(out) = out.for_human() { writeln!(out, "{…}")?; }

// For shell
if let Some(out) = out.for_shell() { writeln!(out, "{…}")?; }

// For JSON
if let Some(out) = out.for_json() { out.write_value(json)?; }
```

**Testing:**
- Use `snapbox::str![]` for assertions: `.stdout_eq(str![])` and `.stderr_eq(str![])`
- Auto-update snapshots: `SNAPSHOTS=overwrite cargo test -p but`
- For color output: use `.stdout_eq(snapbox::file!["snapshots/<test-name>/<invocation>.stdout.term.svg"])`
- Update color snapshots: `SNAPSHOT=overwrite cargo test -p but`

## Adding Dependencies

### JavaScript/TypeScript

```bash
# Add to root workspace
pnpm add -D <package>

# Add to specific package
pnpm add <package> --filter @gitbutler/desktop
pnpm add <package> --filter @gitbutler/ui
```

**Always check for vulnerabilities** before adding npm packages.

### Rust

Edit the appropriate `Cargo.toml`:
- Workspace-level dependencies go in `/Cargo.toml` under `[workspace.dependencies]`
- Individual crates reference workspace versions when used multiple times

**Always check for vulnerabilities** before adding Rust dependencies.

## Troubleshooting

### Turbo/Build Issues

```bash
# Stop turbo daemon
pnpm exec turbo daemon stop

# Clear turbo cache
pnpm exec turbo daemon clean

# Clear node_modules and reinstall
rm -rf .turbo node_modules
pnpm install

# Clear Rust build artifacts
cargo clean
```

### Platform-Specific Issues

**macOS**: Install Xcode and cmake
**Linux**: Install webkit2gtk and other dependencies (see DEVELOPMENT.md)
**Windows**: Requires Perl, OpenSSL setup, and specific compiler settings (see DEVELOPMENT.md)

### Performance Logging

```bash
# Development mode with performance logging
GITBUTLER_PERFORMANCE_LOG=1 LOG_LEVEL=debug pnpm tauri dev

# Release build with performance logging
GITBUTLER_PERFORMANCE_LOG=1 LOG_LEVEL=debug pnpm tauri dev --release
```

## CI/CD

Workflows in `.github/workflows/`:
- `push.yaml` - Main CI for linting, building, testing
- `publish.yaml` - Release builds for different platforms
- `test-e2e-playwright.yml` - E2E tests
- `test-e2e-blackbox.yml` - Blackbox E2E tests

## Development Mode OAuth

To enable GitHub/Google login in development, create `.env.development`:
```
PUBLIC_API_BASE_URL=https://app.gitbutler.com/
```

## Key Conventions

**Frontend File Organization:**
- Use absolute imports: `@gitbutler/ui`, `@gitbutler/shared`
- Components: PascalCase (e.g., `BranchCard.svelte`)
- Files: kebab-case (e.g., `branch-service.ts`)
- Variables/functions: camelCase

**Rust:**
- Follow standard Rust naming conventions
- Use `Result<T, E>` and `anyhow` for error handling
- Most functions should return `anyhow::Result`

**Before committing:**
1. Code is formatted: `pnpm format && pnpm rustfmt`
2. Linting passes: `pnpm lint && cargo clippy --all-targets`
3. Tests pass: `pnpm test && cargo test`
4. Build succeeds: `pnpm build`

Or use: `pnpm isgood`
Auto-fix: `pnpm begood && cargo clippy --fix --all-targets`
