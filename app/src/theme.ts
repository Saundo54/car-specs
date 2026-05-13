import { 
  argbFromHex, 
  themeFromSourceColor, 
  applyTheme 
} from "@material/material-color-utilities";

// Default automotive blue
const DEFAULT_SEED_COLOR = "#1565C0";

export function initializeTheme() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = themeFromSourceColor(argbFromHex(DEFAULT_SEED_COLOR));

  // Apply to document root
  applyTheme(theme, { target: document.body, dark: isDark });

  // Listen for dark mode changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    applyTheme(theme, { target: document.body, dark: e.matches });
  });
}
