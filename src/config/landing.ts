/**
 * Landing content + theme reader.
 * Reads src/content/landing/index.json at build time via import.meta.glob
 * (resolves correctly once bundled, unlike readFileSync). Falls back to
 * defaults matching the original design.
 */

const modules = import.meta.glob<Record<string, any>>(
  '../content/landing/index.json',
  { eager: true, import: 'default' },
);

export type NavItem = { label: string; href: string };

export type Landing = {
  brandName: string;
  brandVersion: string;
  nav: NavItem[];
  railAperture: string;
  railDiameter: string;
  railTolerance: string;
  railRev: string;
  spineText: string;
  spineNumber: string;
  eyebrowLeft: string;
  eyebrowRight: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  theme: {
    colorBgLight: string;
    colorBgDark: string;
    colorInk: string;
    colorMuted: string;
    colorAccent: string;
    fontDisplay: string;
    fontMono: string;
    typeScale: string;
  };
};

const defaults: Landing = {
  brandName: 'SANGUINE',
  brandVersion: 'V.01',
  nav: [
    { label: 'PRODUCT', href: '#' },
    { label: 'SCIENCE', href: '#' },
    { label: 'METHOD',  href: '#' },
    { label: 'ACCESS',  href: '#' },
  ],
  railAperture: 'APERTURE · C',
  railDiameter: 'Ø 412 MM',
  railTolerance: '±0.02',
  railRev: 'REV 04',
  spineText: 'SANGUINE · SYSTEM 01 · BUILD 24.05',
  spineNumber: '04',
  eyebrowLeft: 'A HEALTH INSTRUMENT',
  eyebrowRight: 'BUILT FOR CLINICIANS',
  title: 'Sanguine',
  description:
    'Continuous vital-sign measurement, reduced to the few numbers that decide care. No noise, no dashboards — a calibrated instrument for the people reading the body.',
  primaryLabel: 'REQUEST ACCESS',
  primaryHref: '#',
  secondaryLabel: 'READ THE METHOD',
  secondaryHref: '#',
  footerLeft: 'APERTURE · C',
  footerCenter: 'PLATE 03 / 04 · 2026-05-28',
  footerRight: 'BERLIN / NYC',
  theme: {
    colorBgLight: '#EEECE8',
    colorBgDark: '#D5D2CB',
    colorInk: '#171716',
    colorMuted: '#8C8C86',
    colorAccent: '#DA3A2C',
    fontDisplay: 'Inter',
    fontMono: 'JetBrains+Mono',
    typeScale: '1',
  },
};

let cached: Landing | null = null;

export function getLanding(): Landing {
  if (cached) return cached;
  const found = Object.values(modules)[0] as Partial<Landing> | undefined;
  cached = {
    ...defaults,
    ...(found ?? {}),
    theme: { ...defaults.theme, ...((found && found.theme) || {}) },
    nav: found && Array.isArray(found.nav) && found.nav.length ? found.nav : defaults.nav,
  };
  return cached;
}

export function getThemeStyle(l: Landing = getLanding()): string {
  const t = l.theme;
  return `:root{
    --bg-light:${t.colorBgLight};
    --bg-dark:${t.colorBgDark};
    --ink:${t.colorInk};
    --muted:${t.colorMuted};
    --accent:${t.colorAccent};
    --f-display:'${t.fontDisplay.replace(/\+/g, ' ')}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --f-mono:'${t.fontMono.replace(/\+/g, ' ')}', ui-monospace, 'SFMono-Regular', Menlo, monospace;
    --type-scale:${t.typeScale || '1'};
  }`.replace(/\s+/g, ' ');
}

export function getGoogleFontsUrl(l: Landing = getLanding()): string {
  const display = `family=${l.theme.fontDisplay}:wght@400;500;600;700;800`;
  const mono = `family=${l.theme.fontMono}:wght@400;500`;
  return `https://fonts.googleapis.com/css2?${display}&${mono}&display=swap`;
}
