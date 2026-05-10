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

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const settingsPath = resolve(__dirname, '../content/settings/site/index.json');

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
  if (!existsSync(settingsPath)) {
    cached = defaults;
    return cached;
  }
  try {
    const raw = readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    cached = { ...defaults, ...parsed };
    return cached!;
  } catch (err) {
    console.warn('[settings] failed to read, using defaults:', err);
    cached = defaults;
    return cached;
  }
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
