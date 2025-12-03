# Data Model: Projects Page

**Feature**: 004-projects-page
**Date**: 2025-12-03

## Entities

### Project

Primary entity representing a showcased work item.

**Source**: `/content/projects.json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier, URL-safe slug |
| `name` | string | Yes | Display name of the project |
| `tagline` | string | Yes | One-line description (max 60 chars) |
| `description` | string | Yes | Full description (2-3 sentences) |
| `category` | enum | Yes | One of: `linux`, `web`, `tools`, `learning` |
| `github_url` | string | Yes | Full GitHub repository URL |
| `github_owner` | string | Yes | GitHub username/org (e.g., "JPyke3") |
| `github_repo` | string | Yes | Repository name (e.g., "mbp-manjaro") |
| `featured` | boolean | Yes | Whether to highlight in Featured section |
| `language` | string | No | Primary programming language |
| `language_icon` | string | No | Nerd Font icon class (e.g., "shell") |
| `tags` | string[] | No | Additional tags for search |
| `fallback_stars` | number | No | Static star count for API fallback |
| `fallback_forks` | number | No | Static fork count for API fallback |
| `demo_url` | string | No | Live demo link if applicable |
| `hidden` | boolean | No | If true, only shown via easter egg |

**Example**:
```json
{
  "id": "mbp-manjaro",
  "name": "mbp-manjaro",
  "tagline": "Manjaro Linux for T2 MacBooks",
  "description": "ISO build scripts for running Manjaro Linux on T2 MacBook hardware. Includes custom kernel patches, driver support, and installation guides.",
  "category": "linux",
  "github_url": "https://github.com/JPyke3/mbp-manjaro",
  "github_owner": "JPyke3",
  "github_repo": "mbp-manjaro",
  "featured": true,
  "language": "Shell",
  "language_icon": "shell",
  "tags": ["macbook", "t2", "kernel", "iso"],
  "fallback_stars": 61,
  "fallback_forks": 10
}
```

### Category (Enum)

Classification for filtering projects.

| Value | Display Label | Description |
|-------|---------------|-------------|
| `linux` | Linux | Kernel patches, ISO builds, driver work |
| `web` | Web | Portfolio sites, web experiments |
| `tools` | Tools | Keyboard configs, Neovim plugins, dotfiles |
| `learning` | Learning | Language learning, experiments |
| `hidden` | (not displayed) | Easter egg projects only |

### GitHubStats (Runtime/Cached)

Cached GitHub API response data.

**Source**: localStorage, key format: `pykee_github_{owner}_{repo}`

| Field | Type | Description |
|-------|------|-------------|
| `stars` | number | Current stargazers count |
| `forks` | number | Current forks count |
| `language` | string | Primary language from GitHub |
| `timestamp` | number | Unix timestamp (ms) when cached |

**Example**:
```json
{
  "stars": 61,
  "forks": 10,
  "language": "Shell",
  "timestamp": 1701590400000
}
```

**TTL**: 3,600,000 ms (1 hour)

### FilterState (Runtime)

Current filter/search state.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | `"all"` | Active category filter or "all" |
| `searchTerm` | string | `""` | Current search text |

**URL Hash Mapping**:
- `#linux` → `{ category: "linux", searchTerm: "" }`
- `#search=kernel` → `{ category: "all", searchTerm: "kernel" }`
- `#linux&search=kernel` → `{ category: "linux", searchTerm: "kernel" }`

### ApplicationState (Runtime)

Full runtime state object.

```javascript
var state = {
  projects: [],           // Project[] - loaded from JSON
  activeFilter: 'all',    // string - current category
  searchTerm: '',         // string - current search
  expandedCard: null,     // string|null - ID of expanded card
  visibleCount: 6,        // number - projects shown before "Show more"
  reducedMotion: false,   // boolean - prefers-reduced-motion
  stats: {}               // Record<string, GitHubStats> - cached stats by project ID
};
```

## Data Files

### /content/projects.json

Complete project manifest file.

**Structure**:
```json
{
  "projects": [
    { /* Project object */ },
    { /* Project object */ }
  ]
}
```

**Ordering**: Projects are ordered by display priority:
1. Featured projects first (featured: true)
2. Then by category: linux, tools, web, learning
3. Hidden projects last (hidden: true)

### Full projects.json Content

```json
{
  "projects": [
    {
      "id": "mbp-manjaro",
      "name": "mbp-manjaro",
      "tagline": "Manjaro Linux for T2 MacBooks",
      "description": "ISO build scripts for running Manjaro Linux on T2 MacBook hardware. Includes custom kernel patches, driver support, and installation guides for Apple's T2 security chip Macs.",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/mbp-manjaro",
      "github_owner": "JPyke3",
      "github_repo": "mbp-manjaro",
      "featured": true,
      "language": "Shell",
      "language_icon": "shell",
      "tags": ["macbook", "t2", "kernel", "iso", "manjaro"],
      "fallback_stars": 61,
      "fallback_forks": 10
    },
    {
      "id": "arch-mbp-archiso",
      "name": "arch-mbp-archiso",
      "tagline": "Arch Linux for MacBook Pro",
      "description": "Custom Arch Linux ISO tailored for 2018+ MacBook Pro models. Includes T2 chip support, Wi-Fi drivers, and a streamlined installation process.",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/arch-mbp-archiso",
      "github_owner": "JPyke3",
      "github_repo": "arch-mbp-archiso",
      "featured": true,
      "language": "Shell",
      "language_icon": "shell",
      "tags": ["macbook", "t2", "arch", "iso"],
      "fallback_stars": 11,
      "fallback_forks": 2
    },
    {
      "id": "mbp-manjaro-kernel",
      "name": "mbp-manjaro-kernel",
      "tagline": "Custom kernel with T2 patches",
      "description": "Manjaro kernel package with patches for Apple T2 MacBook support. Includes touchbar, audio, and SSD drivers not in mainline.",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/mbp-manjaro-kernel",
      "github_owner": "JPyke3",
      "github_repo": "mbp-manjaro-kernel",
      "featured": false,
      "language": "Shell",
      "language_icon": "shell",
      "tags": ["kernel", "t2", "manjaro"],
      "fallback_stars": 2,
      "fallback_forks": 0
    },
    {
      "id": "mbp-arch-install",
      "name": "mbp-arch-install",
      "tagline": "T2 MacBook Arch setup script",
      "description": "Automated installation script for setting up Arch Linux on T2 MacBooks. Handles partitioning, bootloader, and driver installation.",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/mbp-arch-install",
      "github_owner": "JPyke3",
      "github_repo": "mbp-arch-install",
      "featured": false,
      "language": "Shell",
      "language_icon": "shell",
      "tags": ["arch", "install", "t2"],
      "fallback_stars": 1,
      "fallback_forks": 0
    },
    {
      "id": "corne-zmk-config",
      "name": "corne-wireless-view-zmk-config",
      "tagline": "ZMK config for Corne keyboard",
      "description": "Personal ZMK firmware configuration for the Corne (CRKBD) split wireless keyboard. Includes custom layers, combos, and home row mods.",
      "category": "tools",
      "github_url": "https://github.com/JPyke3/corne-wireless-view-zmk-config",
      "github_owner": "JPyke3",
      "github_repo": "corne-wireless-view-zmk-config",
      "featured": false,
      "language": "Devicetree",
      "language_icon": "keyboard",
      "tags": ["zmk", "keyboard", "corne", "split"],
      "fallback_stars": 0,
      "fallback_forks": 0
    },
    {
      "id": "codecompanion-nvim",
      "name": "codecompanion.nvim",
      "tagline": "Neovim AI assistant fork",
      "description": "Fork of CodeCompanion.nvim with personal customizations for LLM-assisted coding in Neovim. Includes custom prompts and keybindings.",
      "category": "tools",
      "github_url": "https://github.com/JPyke3/codecompanion.nvim",
      "github_owner": "JPyke3",
      "github_repo": "codecompanion.nvim",
      "featured": false,
      "language": "Lua",
      "language_icon": "lua",
      "tags": ["neovim", "ai", "copilot", "lua"],
      "fallback_stars": 0,
      "fallback_forks": 0
    },
    {
      "id": "pykee",
      "name": "pyk.ee",
      "tagline": "This very website",
      "description": "Personal portfolio and blog with a Portal/Aperture Science terminal aesthetic. Zero-build vanilla JS, handcrafted CSS, and plenty of easter eggs.",
      "category": "web",
      "github_url": "https://github.com/JPyke3/pyk.ee",
      "github_owner": "JPyke3",
      "github_repo": "pyk.ee",
      "featured": false,
      "language": "JavaScript",
      "language_icon": "javascript",
      "tags": ["portfolio", "blog", "vanilla-js", "portal"],
      "fallback_stars": 0,
      "fallback_forks": 0,
      "demo_url": "https://pyk.ee"
    },
    {
      "id": "jacobpyke-com",
      "name": "JacobPyke.com",
      "tagline": "Previous AngularDart portfolio",
      "description": "My old portfolio site built with AngularDart. A relic from the before times, kept for historical purposes and occasional nostalgia.",
      "category": "web",
      "github_url": "https://github.com/JPyke3/JacobPyke.com",
      "github_owner": "JPyke3",
      "github_repo": "JacobPyke.com",
      "featured": false,
      "language": "Dart",
      "language_icon": "dart",
      "tags": ["angular", "dart", "portfolio", "legacy"],
      "fallback_stars": 0,
      "fallback_forks": 0
    },
    {
      "id": "jiten",
      "name": "Jiten",
      "tagline": "Japanese learning project",
      "description": "A personal project for learning Japanese. Includes vocabulary tools, kanji practice, and study tracking. 日本語の勉強は楽しい！",
      "category": "learning",
      "github_url": "https://github.com/JPyke3/Jiten",
      "github_owner": "JPyke3",
      "github_repo": "Jiten",
      "featured": false,
      "language": "JavaScript",
      "language_icon": "javascript",
      "tags": ["japanese", "language", "learning", "kanji"],
      "fallback_stars": 0,
      "fallback_forks": 0
    }
  ]
}
```

## Relationships

```
projects.json (static)
       │
       ▼
   Project[]
       │
       ├──> Category (enum filter)
       │
       └──> GitHubStats (runtime enrichment)
                │
                ▼
           localStorage cache
```

## Validation Rules

### Project
- `id`: Required, unique, lowercase alphanumeric + hyphens
- `name`: Required, max 50 characters
- `tagline`: Required, max 60 characters
- `description`: Required, max 300 characters
- `category`: Required, must be valid enum value
- `github_url`: Required, valid GitHub URL format
- `github_owner`: Required, extracted from github_url
- `github_repo`: Required, extracted from github_url
- `featured`: Required, boolean
- `fallback_stars`: Optional, non-negative integer
- `fallback_forks`: Optional, non-negative integer

### GitHubStats Cache
- `timestamp`: Must be within TTL (1 hour) to be valid
- `stars`: Non-negative integer
- `forks`: Non-negative integer
