/**
 * Theme & brand settings reader.
 *
 * Reads `src/content/settings/site/index.json` (where Keystatic writes
 * the Theme & Brand singleton) at BUILD TIME via Vite's import.meta.glob,
 * so edits committed by Keystatic take effect on the next build.
 *
 * Exposes:
 *   - getSettings(): typed access to all fields (with defaults)
 *   - getThemeStyle(): an inline CSS string to drop into <head>
 *   - getGoogleFontsUrl(): dynamic Google Fonts URL based on selection
 *   - getHtmlDataAttrs(): data-* attributes for <html> (density, grain)
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
  fontArabic: string;
  baseFontSize: string;        // '15' | '16' | '17' | '18'
  headingWeight: string;       // 'auto' | '300' | '400' | '500' | '600'
  bodyWeight: string;          // '300' | '400' | '500'
  density: 'compact' | 'normal' | 'spacious';
  contentWidth: 'narrow' | 'standard' | 'wide';
  cornerRadius: 'sharp' | 'soft' | 'rounded';
  shadowStrength: 'none' | 'subtle' | 'strong';
  paperGrain: boolean;
  direction: 'ltr' | 'rtl';
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
  fontArabic:  'Noto+Sans+Arabic',
  baseFontSize: '16',
  headingWeight: 'auto',
  bodyWeight: '400',
  density: 'normal',
  contentWidth: 'standard',
  cornerRadius: 'soft',
  shadowStrength: 'subtle',
  paperGrain: true,
  direction: 'ltr',
  footerDisclaimer: 'The information here is not medical advice.',
  socials: [],
};

let cached: ThemeSettings | null = null;

export function getSettings(): ThemeSettings {
  if (cached) return cached;
  const found = Object.values(settingsModules)[0] as Partial<ThemeSettings> | undefined;
  cached = { ...defaults, ...(found ?? {}) };
  return cached;
}

/* ---- Lookup tables for the select-driven tokens ---- */
const WIDTHS:  Record<string, string> = { narrow: '1100px', standard: '1280px', wide: '1440px' };
const RADII:   Record<string, [string, string, string]> = {
  sharp:   ['0px', '0px', '0px'],
  soft:    ['2px', '4px', '8px'],
  rounded: ['6px', '10px', '16px'],
};
const SHADOWS: Record<string, [string, string, string]> = {
  none:   ['none', 'none', 'none'],
  subtle: ['0 1px 2px rgba(31,29,23,0.04)', '0 4px 16px rgba(31,29,23,0.06)', '0 12px 40px rgba(31,29,23,0.08)'],
  strong: ['0 2px 4px rgba(31,29,23,0.08)', '0 8px 28px rgba(31,29,23,0.12)', '0 20px 60px rgba(31,29,23,0.18)'],
};

/** Inline CSS that overrides the design-token control surface. */
export function getThemeStyle(s: ThemeSettings = getSettings()): string {
  const [rs, rm, rl] = RADII[s.cornerRadius] ?? RADII.soft;
  const [ss, sm, sl] = SHADOWS[s.shadowStrength] ?? SHADOWS.subtle;
  const width = WIDTHS[s.contentWidth] ?? WIDTHS.standard;

  let css = `:root{
    --c-paper:${s.colorPaper};
    --c-ink:${s.colorInk};
    --c-moss:${s.colorMoss};
    --c-bark:${s.colorBark};
    --c-rule:${s.colorRule};
    --f-display:'${s.fontDisplay.replace(/\+/g, ' ')}', 'Cormorant Garamond', Georgia, serif;
    --f-body:'${s.fontBody.replace(/\+/g, ' ')}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --f-arabic:'${s.fontArabic.replace(/\+/g, ' ')}', 'Noto Sans Arabic', 'Segoe UI', sans-serif;
    --root-font-size:${s.baseFontSize}px;
    --weight-body:${s.bodyWeight};
    --container-max:${width};
    --radius-sm:${rs};
    --radius-md:${rm};
    --radius-lg:${rl};
    --shadow-sm:${ss};
    --shadow-md:${sm};
    --shadow-lg:${sl};`;

  // Only override the heading weight when the user picked a specific one;
  // 'auto' leaves each component's designed weight intact.
  if (s.headingWeight !== 'auto') {
    css += `--weight-display:${s.headingWeight};`;
  }

  css += `}`;
  return css.replace(/\s+/g, ' ');
}

/**
 * Build the Google Fonts URL for the chosen display + body + Arabic fonts.
 * Font names use `+` for spaces (Google Fonts URL encoding).
 */
export function getGoogleFontsUrl(s: ThemeSettings = getSettings()): string {
  const display = `family=${s.fontDisplay}:opsz,wght@9..144,300..700`;
  const body    = `family=${s.fontBody}:wght@300..700`;
  const arabic  = `family=${s.fontArabic}:wght@300..700`;
  return `https://fonts.googleapis.com/css2?${display}&${body}&${arabic}&display=swap`;
}

/** Attributes for the <html> element (direction, language, density, grain). */
export function getHtmlDataAttrs(s: ThemeSettings = getSettings()): Record<string, string> {
  return {
    dir: s.direction,
    lang: s.direction === 'rtl' ? 'ar' : 'en',
    'data-density': s.density,
    'data-grain': s.paperGrain ? 'on' : 'off',
  };
}
