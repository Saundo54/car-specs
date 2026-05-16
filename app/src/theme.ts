import { 
  argbFromHex, 
  themeFromSourceColor, 
  applyTheme 
} from "@material/material-color-utilities";

// Default automotive blue
const DEFAULT_SEED_COLOR = "#1565C0";
const STORAGE_KEY = "carSpecColorMode";

type ThemeMode = 'light' | 'dark' | 'system';

const theme = themeFromSourceColor(argbFromHex(DEFAULT_SEED_COLOR));

function prefersDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  const isDark = mode === 'dark' || (mode === 'system' && prefersDarkMode());
  applyTheme(theme, { target: document.body, dark: isDark });
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function initializeTheme() {
  const mode = getStoredThemeMode();
  applyThemeMode(mode);

  if (mode === 'system') {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      applyTheme(theme, { target: document.body, dark: e.matches });
    });
  }
}
