## Context

Dark mode currently breaks readability due to hardcoded light-theme assumptions.

## Goals / Non-Goals

**Goals:**
- Fix text/background contrast for all screens in dark mode.
- Use M3 tokens for all semantic colors (better/worse/diff).

## Decisions

### 1. Global Variable Inheritance
We will ensure `body` and `#root` explicitly use `var(--md-sys-color-surface)` and `var(--md-sys-color-on-surface)`.
- **Rationale**: Prevents un-styled "white" patches in some browsers when dark mode is active.

### 2. Highlighting: Containers over Transparencies
We will switch from `rgba(green, 0.1)` to `var(--md-sys-color-tertiary-container)`.
- **Rationale**: Semantic tokens automatically invert correctly in dark mode, maintaining legibility of the text inside the highlight.
