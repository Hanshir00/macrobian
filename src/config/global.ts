/**
 * Global / Site Chrome reader.
 *
 * Reads `src/content/global/site/index.json` (the "Global / Site Chrome"
 * singleton in Keystatic) at BUILD TIME via Vite's import.meta.glob, so
 * edits committed through the admin take effect on the next build.
 */

const globalModules = import.meta.glob<Record<string, unknown>>(
  '../content/global/site/index.json',
  { eager: true, import: 'default' },
);

export type NavLink = { label: string; href: string };

export type SiteGlobal = {
  nav: NavLink[];
  bannerEnabled: boolean;
  bannerText: string;
  bannerLink: string;
  footerNav: NavLink[];
  footerNote: string;
  notFoundTitle: string;
  notFoundMessage: string;
};

const defaults: SiteGlobal = {
  nav: [
    { label: 'Repository', href: '/repository' },
    { label: 'Sanguine',   href: '/sanguine' },
    { label: 'Presentations', href: '/presentations' },
  ],
  bannerEnabled: false,
  bannerText: '',
  bannerLink: '',
  footerNav: [],
  footerNote: '',
  notFoundTitle: 'Page not found',
  notFoundMessage:
    'The page you are looking for has moved or never existed. Return home and start again.',
};

let cached: SiteGlobal | null = null;

export function getSiteGlobal(): SiteGlobal {
  if (cached) return cached;
  const found = Object.values(globalModules)[0] as Partial<SiteGlobal> | undefined;
  cached = { ...defaults, ...(found ?? {}) };
  // Guard against an empty nav array wiping navigation entirely.
  if (!cached.nav || cached.nav.length === 0) cached.nav = defaults.nav;
  return cached;
}
