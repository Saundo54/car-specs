## Why

The application currently has poor readability in dark mode because many UI elements use hardcoded light-theme colors or lack proper contrast when the system color scheme switches. Implementing comprehensive dark mode support using Material You (M3) tokens ensures a consistent, accessible, and readable experience across all device settings.

## What Changes

- Update `index.css` to set global background and text colors using CSS variables.
- Refactor `SearchScreen.tsx` and `ComparisonScreen.tsx` to remove hardcoded color values and use semantic Material You tokens.
- Update `ComparisonScreen.module.css` to use tonal containers for "better/worse" highlighting instead of semi-transparent rgba colors, ensuring visibility in both modes.
- Ensure all accordion and list headers adapt their background colors based on the active theme.

## Capabilities

### Modified Capabilities
- `pwa-core-ui`: Enhanced with full system-aware dark mode support.
- `vehicle-search-ui`: UI styles updated for theme compatibility.
- `vehicle-comparison-ui`: Highlighting logic and table styles updated for theme compatibility.

## Impact

- **Frontend**: Global CSS and component-specific style module updates.
- **Accessibility**: Significant improvement in contrast and readability for dark mode users.
