---
name: GitHub Sync Pro
description: Advanced guidelines for synchronizing the local project with a remote GitHub repository using state tracking and parallel execution.
---

# GitHub Sync Pro Guidelines

Use this skill to synchronize the local project with a remote GitHub repository. This "Pro" version uses state tracking to perform incremental updates and manage conflicts.

## Workflow

### 1. Initialization & State Check
- **Read Sync State**: Check for `.sync-state.json` in the root.
- **Identify Repository**: Extract owner, repo, and branch (default `main`) from the URL.
- **Fetch Current Remote SHA**: Get the latest commit SHA from `https://api.github.com/repos/{owner}/{repo}/commits/{branch}`.

### 2. Difference Analysis
- **Incremental Sync (Preferred)**: If `.sync-state.json` exists and contains a `lastSyncedSha`:
  - Call the Compare API: `https://api.github.com/repos/{owner}/{repo}/compare/{lastSyncedSha}...{currentRemoteSha}`.
  - Parse the `files` array to identify `added`, `modified`, and `removed` files.
- **Full Sync (Fallback)**: If no state exists:
  - Fetch the full tree: `https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`.
  - Compare with the local file tree to identify differences.

### 3. Change Preview & Confirmation
- **Summarize Changes**: Present a clear list of changes to the user (e.g., "3 files added, 2 modified, 1 removed").
- **Conflict Warning**: If a local file has been modified since the last sync (compare local content hash with stored SHA), warn the user before overwriting.
- **Wait for Confirmation**: Ask the user: "Would you like me to apply these changes?"

### 4. Parallel Execution
- **Fetch Content**: For all added/modified files, fetch raw content in parallel (up to 8 concurrent calls) using `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`.
- **Apply Updates**:
  - Use `create_file` for new files.
  - Use `create_file` with `Overwrite: true` for modified files.
  - Use `delete_file` for removed files (only after explicit user confirmation).

### 5. Post-Sync Actions
- **Dependency Check**: If `package.json` was updated, run `install_applet_dependencies`.
- **Update State**: Save the new `currentRemoteSha` and file SHAs into `.sync-state.json`.
- **Verification**: Run `compile_applet` and `lint_applet`.
- **Restart Server**: Call `restart_dev_server` if critical configuration or server-side files changed.

## Constraints
- **No Git Commands**: Strictly use HTTP APIs and file tools.
- **Respect .gitignore**: Do not sync files or directories listed in `.gitignore`.
- **Secret Protection**: Never overwrite files containing local secrets (e.g., `.env`, `firebase-applet-config.json`) with remote placeholders.
- **Atomic State Update**: Only update `.sync-state.json` after all file operations succeed.
