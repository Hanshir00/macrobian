/**
 * Sanguine — Site Configuration
 * --------------------------------------------------------------
 * This file is the single source of truth for site-wide brand
 * details. Edit anything here and it propagates everywhere.
 * --------------------------------------------------------------
 */

export const site = {
  // Brand
  name: 'Sanguine',
  tagline: 'A repository of inquiry. A practice of vitality.',
  description:
    'Sanguine is a personal repository of literature and research, paired with practical guidance on peptides, nootropics, and the pursuit of robust health.',

  // Domain — update after connecting in Netlify
  url: 'https://sanguine.example.com',

  // Author / owner
  author: {
    name: 'Sanguine',
    email: 'hello@sanguine.example.com',
  },

  // Footer / contact socials — leave any blank to hide
  socials: {
    instagram: '',     // e.g. 'https://instagram.com/yourhandle'
    twitter: '',       // e.g. 'https://twitter.com/yourhandle'
    substack: '',      // e.g. 'https://yourname.substack.com'
    youtube: '',       // e.g. 'https://youtube.com/@yourhandle'
    linkedin: '',
    github: '',
  },
} as const;

/**
 * Top-level navigation. The landing page splits into these two
 * paths. Order matters — the first item appears on the left.
 */
export const primaryNav = [
  {
    label: 'Repository',
    href: '/repository',
    description: 'Literature, studies, and books.',
  },
  {
    label: 'Sanguine',
    href: '/sanguine',
    description: 'Peptides, nootropics, and contact.',
  },
] as const;

/**
 * Sanguine sub-section navigation.
 */
export const sanguineNav = [
  { label: 'Peptides', href: '/sanguine/peptides' },
  { label: 'Nootropics', href: '/sanguine/nootropics' },
  { label: 'Contact', href: '/sanguine/contact' },
] as const;
