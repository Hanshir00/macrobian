/**
 * Helper to read a block-composed page singleton from disk.
 *
 * Each of these pages (home, sanguine, contact) is a singleton in
 * Keystatic that writes to `src/content/pages/<name>/index.json`.
 * If the file doesn't exist yet (fresh install), returns a sensible
 * default page.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export type Block =
  | { discriminant: 'hero';          value: { eyebrow?: string; title: string; tagline?: string; align: 'center' | 'left'; size: 'display' | 'large' | 'medium' } }
  | { discriminant: 'portal';        value: { eyebrow?: string; tiles: { label: string; description?: string; href: string }[] } }
  | { discriminant: 'sectionHeader'; value: { eyebrow?: string; title: string; description?: string; align: 'left' | 'center' } }
  | { discriminant: 'sectionList';   value: { title?: string; items: { label: string; description?: string; href: string; external: boolean }[] } }
  | { discriminant: 'prose';         value: { content: string } }
  | { discriminant: 'quote';         value: { text: string; attribution?: string } }
  | { discriminant: 'image';         value: { src: string; alt: string; caption?: string; width: 'narrow' | 'standard' | 'full' } }
  | { discriminant: 'disclaimer';    value: { text: string } }
  | { discriminant: 'contactInfo';   value: { emailLabel: string; email: string; socialsLabel: string; socials: { platform: string; url: string }[] } }
  | { discriminant: 'spacer';        value: { size: 'sm' | 'md' | 'lg' | 'xl' } }
  | { discriminant: 'footnote';      value: { text: string; divider: boolean } };

export type Page = {
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  blocks: Block[];
};

export function getPage(name: 'home' | 'sanguine' | 'contact'): Page {
  const path = resolve(__dirname, `../content/pages/${name}/index.json`);
  if (!existsSync(path)) {
    return defaultPage(name);
  }
  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as Page;
  } catch (err) {
    console.warn(`[pages] failed to read ${name}, using default:`, err);
    return defaultPage(name);
  }
}

/* Sensible fallback pages, used before the editor has saved anything. */
function defaultPage(name: 'home' | 'sanguine' | 'contact'): Page {
  if (name === 'home') {
    return {
      title: 'Sanguine',
      description: 'A repository of inquiry. A practice of vitality.',
      showHeader: false,
      showFooter: false,
      blocks: [
        {
          discriminant: 'hero',
          value: {
            eyebrow: 'Est. MMXXVI',
            title: 'Sanguine',
            tagline: 'A repository of inquiry. A practice of vitality.',
            align: 'center',
            size: 'display',
          },
        },
        {
          discriminant: 'portal',
          value: {
            tiles: [
              { label: 'Repository', description: 'Literature, studies, and books.', href: '/repository' },
              { label: 'Sanguine',   description: 'Peptides, nootropics, and contact.', href: '/sanguine' },
            ],
          },
        },
        {
          discriminant: 'footnote',
          value: { text: 'A practice of inquiry and vitality.', divider: false },
        },
      ],
    };
  }
  if (name === 'sanguine') {
    return {
      title: 'Sanguine',
      description: 'Practical guidance on peptides, nootropics, and the pursuit of robust health.',
      blocks: [
        {
          discriminant: 'sectionHeader',
          value: {
            eyebrow: 'Sanguine',
            title: 'Practical guidance, carefully considered.',
            description: 'Peptides and nootropics, mapped from the literature and refined in practice. A repository of working knowledge — not a substitute for medical care.',
            align: 'left',
          },
        },
        {
          discriminant: 'sectionList',
          value: {
            items: [
              { label: 'Peptides',   description: 'A working catalog of peptides.',   href: '/sanguine/peptides',   external: false },
              { label: 'Nootropics', description: 'A working catalog of nootropics.', href: '/sanguine/nootropics', external: false },
              { label: 'Contact',    description: 'Get in touch.',                    href: '/sanguine/contact',    external: false },
            ],
          },
        },
        {
          discriminant: 'disclaimer',
          value: {
            text: 'The information on this site is for educational purposes only and does not constitute medical advice. Consult a qualified clinician before making any change to your health practices.',
          },
        },
      ],
    };
  }
  // contact
  return {
    title: 'Contact',
    description: 'Get in touch.',
    blocks: [
      {
        discriminant: 'sectionHeader',
        value: {
          eyebrow: 'Sanguine',
          title: 'Contact',
          description: 'The fastest way to reach me.',
          align: 'left',
        },
      },
      {
        discriminant: 'contactInfo',
        value: {
          emailLabel: 'Email',
          email: 'hello@sanguine.example.com',
          socialsLabel: 'Elsewhere',
          socials: [],
        },
      },
    ],
  };
}
