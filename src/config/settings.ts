/**
 * Theme & brand settings reader.
 *
 * Reads `src/content/settings/site/index.json` (where Keystatic writes
 * the Theme & Brand singleton). Falls back to defaults if the file
 * doesn't exist yet (e.g. fresh setup, before the editor has saved).
 *
 * Exposes:
 *   - settings: typed access to all fields
 *   - themeStyle: an inline CSS string to drop into <head>
 *   - googleFontsUrl: dynamic Google Fonts URL based on selection
 */

/**
 * Read the settings JSON at BUILD TIME using Vite's import.meta.glob.
 * This resolves the path against the real source tree (not the bundled
 * output), so edits committed by Keystatic actually take effect on the
 * next build. `eager: true` inlines the parsed JSON at build time.
 */
const settingsModules = import.meta.glob<Record<string, unknown>>(
  '../content/settings/site/index.json',
  { eager: true, import: 'default' },
);

export type ThemeSettings = {
  siteName: string;
  tagline: string;
  description: string;
  colorPaper: string;
  colorInk: string;
  colorMoss: string;
  colorBark: string;
  colorRule: string;
  fontDisplay: string;
  fontBody: string;
  density: 'compact' | 'normal' | 'spacious';
  footerDisclaimer: string;
  socials: { platform: string; url: string }[];
};

const defaults: ThemeSettings = {
  siteName: 'Sanguine',
  tagline: 'A repository of inquiry. A practice of vitality.',
  description:
    'Sanguine is a personal repository of literature and research, paired with practical guidance on peptides, nootropics, and the pursuit of robust health.',
  colorPaper: '#F5EFE4',
  colorInk:   '#1F1D17',
  colorMoss:  '#7A8B6E',
  colorBark:  '#7B5E40',
  colorRule:  '#D4C9B3',
  fontDisplay: 'Fraunces',
  fontBody:    'Manrope',
  density: 'normal',
  footerDisclaimer: 'The information here is not medical advice.',
  socials: [],
};

let cached: ThemeSettings | null = null;

export function getSettings(): ThemeSettings {
  if (cached) return cached;
  // There's exactly one match for this glob (or none on a fresh setup).
  const found = Object.values(settingsModules)[0] as Partial<ThemeSettings> | undefined;
  cached = { ...defaults, ...(found ?? {}) };
  return cached;
}

/** Inline CSS that overrides the design-token control surface. */
export function getThemeStyle(s: ThemeSettings = getSettings()): string {
  return `:root{
    --c-paper:${s.colorPaper};
    --c-ink:${s.colorInk};
    --c-moss:${s.colorMoss};
    --c-bark:${s.colorBark};
    --c-rule:${s.colorRule};
    --f-display:'${s.fontDisplay.replace(/\+/g, ' ')}', 'Cormorant Garamond', Georgia, serif;
    --f-body:'${s.fontBody.replace(/\+/g, ' ')}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }`.replace(/\s+/g, ' ');
}

/**
 * Build the Google Fonts URL for the chosen display + body fonts.
 * The font names use `+` for spaces because that's how Google Fonts
 * URL-encodes them.
 */
export function getGoogleFontsUrl(s: ThemeSettings = getSettings()): string {
  // Try variable axes first; many fonts on this list support them.
  // For fonts that don't, the URL will degrade gracefully to static weights.
  const display = `family=${s.fontDisplay}:opsz,wght@9..144,300..700`;
  const body    = `family=${s.fontBody}:wght@300..700`;
  return `https://fonts.googleapis.com/css2?${display}&${body}&display=swap`;
}
