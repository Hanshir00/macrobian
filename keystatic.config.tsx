/**
 * Sanguine — Keystatic CMS Configuration
 * --------------------------------------------------------------
 * This file is the single source of truth for the editing schema.
 * It defines:
 *   - Collections (multi-entry content): peptides, nootropics, and the
 *     three repository data tables (topics, subtopics, links).
 *   - Singletons (one-off content): the global theme settings, plus the
 *     three block-composed pages (home, sanguine, contact).
 *   - The shared block library used in those pages — every reusable
 *     section type a page can be composed of.
 *
 * Edit a field here and it appears in /keystatic for the editor.
 * --------------------------------------------------------------
 */

import { config, fields, collection, singleton } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

/* =========================================================
   STORAGE
   --------------------------------------------------------
   Local mode in dev (writes to disk for fast iteration).
   Cloud mode in production — auth handled by Keystatic Cloud,
   commits land in this GitHub repo via their OAuth layer.

   `import.meta.env.DEV` is `true` during `npm run dev` and
   `false` during `npm run build` / production.
   ========================================================= */

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : ({ kind: 'cloud' } as const);

/* =========================================================
   BLOCK LIBRARY
   --------------------------------------------------------
   Each block becomes a draggable, reorderable section in any page
   that uses the page-blocks field. Add new block types here and
   they automatically become available everywhere.

   Each entry is `{ label, schema }` — the label is what shows in
   the "Add block" menu, and schema is the fields the block renders.
   ========================================================= */

const pageBlocks = {
  hero: {
    label: 'Hero — large title + tagline',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow (small caps)' }),
      title:   fields.text({ label: 'Title', validation: { isRequired: true } }),
      tagline: fields.text({ label: 'Tagline', multiline: true }),
      align: fields.select({
        label: 'Alignment',
        options: [
          { label: 'Center', value: 'center' },
          { label: 'Left',   value: 'left' },
        ],
        defaultValue: 'center',
      }),
      size: fields.select({
        label: 'Size',
        options: [
          { label: 'Display (giant brand mark)', value: 'display' },
          { label: 'Large',                       value: 'large' },
          { label: 'Medium',                      value: 'medium' },
        ],
        defaultValue: 'large',
      }),
    }),
  },

  portal: {
    label: 'Portal — split tiles linking to other sections',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      tiles: fields.array(
        fields.object({
          label:       fields.text({ label: 'Label', validation: { isRequired: true } }),
          description: fields.text({ label: 'Description', multiline: true }),
          href:        fields.text({ label: 'Link path', description: 'e.g. /repository', validation: { isRequired: true } }),
        }),
        {
          label: 'Tiles',
          itemLabel: (props) => props.fields.label.value || 'Untitled tile',
        },
      ),
    }),
  },

  sectionHeader: {
    label: 'Section header — eyebrow, title, description',
    schema: fields.object({
      eyebrow:     fields.text({ label: 'Eyebrow' }),
      title:       fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
      align: fields.select({
        label: 'Alignment',
        options: [
          { label: 'Left',   value: 'left' },
          { label: 'Center', value: 'center' },
        ],
        defaultValue: 'left',
      }),
    }),
  },

  sectionList: {
    label: 'Section list — bordered list of links',
    schema: fields.object({
      title: fields.text({ label: 'Section title (eyebrow)' }),
      items: fields.array(
        fields.object({
          label:       fields.text({ label: 'Label', validation: { isRequired: true } }),
          description: fields.text({ label: 'Description' }),
          href:        fields.text({ label: 'Link', validation: { isRequired: true } }),
          external:    fields.checkbox({ label: 'Opens in new tab', defaultValue: false }),
        }),
        {
          label: 'Items',
          itemLabel: (props) => props.fields.label.value || 'Untitled item',
        },
      ),
    }),
  },

  prose: {
    label: 'Prose — paragraphs of text',
    schema: fields.object({
      content: fields.text({
        label: 'Content',
        multiline: true,
        description:
          'Plain prose with paragraph breaks. Each blank line starts a new paragraph. For rich markdown formatting, use the Peptide or Nootropic body fields.',
        validation: { isRequired: true },
      }),
    }),
  },

  quote: {
    label: 'Quote — pull quote with optional attribution',
    schema: fields.object({
      text:        fields.text({ label: 'Quote', multiline: true, validation: { isRequired: true } }),
      attribution: fields.text({ label: 'Attribution' }),
    }),
  },

  image: {
    label: 'Image — figure with caption',
    schema: fields.object({
      src: fields.image({
        label: 'Image',
        directory: 'public/images/uploads',
        publicPath: '/images/uploads/',
        validation: { isRequired: true },
      }),
      alt:     fields.text({ label: 'Alt text', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption' }),
      width: fields.select({
        label: 'Width',
        options: [
          { label: 'Narrow',     value: 'narrow' },
          { label: 'Standard',   value: 'standard' },
          { label: 'Full bleed', value: 'full' },
        ],
        defaultValue: 'standard',
      }),
    }),
  },

  disclaimer: {
    label: 'Disclaimer — boxed italic note',
    schema: fields.object({
      text: fields.text({
        label: 'Disclaimer text',
        multiline: true,
        defaultValue:
          'The information on this site is for educational purposes only and does not constitute medical advice. Consult a qualified clinician before making any change to your health practices.',
        validation: { isRequired: true },
      }),
    }),
  },

  contactInfo: {
    label: 'Contact info — email + socials',
    schema: fields.object({
      emailLabel:   fields.text({ label: 'Email label', defaultValue: 'Email' }),
      email:        fields.text({ label: 'Email address', validation: { isRequired: true } }),
      socialsLabel: fields.text({ label: 'Socials label', defaultValue: 'Elsewhere' }),
      socials: fields.array(
        fields.object({
          platform: fields.text({ label: 'Platform name (e.g. Instagram)' }),
          url:      fields.text({ label: 'URL' }),
        }),
        {
          label: 'Social links',
          itemLabel: (props) => props.fields.platform.value || 'Untitled',
        },
      ),
    }),
  },

  spacer: {
    label: 'Spacer — vertical whitespace between blocks',
    schema: fields.object({
      size: fields.select({
        label: 'Size',
        options: [
          { label: 'Small',  value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large',  value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
        ],
        defaultValue: 'md',
      }),
    }),
  },

  footnote: {
    label: 'Footnote — small text with optional divider',
    schema: fields.object({
      text:    fields.text({ label: 'Text', validation: { isRequired: true } }),
      divider: fields.checkbox({ label: 'Show divider above', defaultValue: true }),
    }),
  },
};

/* The page-blocks field used by every block-composed page. */
const pageBlocksField = fields.blocks(pageBlocks, {
  label: 'Blocks',
  description: 'Add, reorder, and configure the sections of this page.',
});

/* =========================================================
   INLINE ARTICLE COMPONENTS
   --------------------------------------------------------
   These appear in the "+" insert menu inside the rich-text body
   of peptide and nootropic articles. They write Markdoc tags into
   the .mdoc file, which markdoc.config.mjs renders via matching
   Astro components in src/components/markdoc/.

   wrapper() = has children (wraps rich text). block() = self-closing.
   ========================================================= */

const articleComponents = {
  callout: wrapper({
    label: 'Callout',
    description: 'Highlighted info box that wraps text.',
    schema: {
      tone: fields.select({
        label: 'Tone',
        options: [
          { label: 'Info',  value: 'info' },
          { label: 'Tip',   value: 'tip' },
          { label: 'Note',  value: 'note' },
        ],
        defaultValue: 'info',
      }),
      title: fields.text({ label: 'Title (optional)' }),
    },
  }),

  warning: wrapper({
    label: 'Warning / Caution',
    description: 'Caution box that wraps text.',
    schema: {
      title: fields.text({ label: 'Title', defaultValue: 'Caution' }),
    },
  }),

  dosage: block({
    label: 'Dosage',
    description: 'Structured dosage summary.',
    schema: {
      amount:    fields.text({ label: 'Amount',    description: 'e.g. 250 mcg' }),
      frequency: fields.text({ label: 'Frequency', description: 'e.g. once daily' }),
      route:     fields.text({ label: 'Route',     description: 'e.g. subcutaneous' }),
      notes:     fields.text({ label: 'Notes',     description: 'optional' }),
    },
  }),

  citation: block({
    label: 'Citation',
    description: 'A reference / source.',
    schema: {
      authors: fields.text({ label: 'Authors' }),
      title:   fields.text({ label: 'Title' }),
      source:  fields.text({ label: 'Source / Journal' }),
      year:    fields.text({ label: 'Year' }),
      url:     fields.text({ label: 'URL (optional)' }),
    },
  }),
};

/* =========================================================
   CONFIG
   ========================================================= */

export default config({
  storage,

  // Keystatic Cloud project identifier. Used in production to authenticate
  // editors via Keystatic Cloud's OAuth layer (see https://keystatic.cloud).
  // Free for up to 3 team members per project.
  cloud: { project: 'sanguinebio/sanguine' },

  ui: {
    brand: { name: 'Sanguine' },
    navigation: {
      'Site': ['siteGlobal', 'settings', 'pageHome', 'pageSanguine', 'pageContact'],
      'Sanguine — Wellness': ['peptides', 'nootropics'],
      'Repository': ['repoTopics', 'repoSubtopics', 'repoLinks'],
      'Presentations': ['presentations'],
    },
  },

  /* ------------------ SINGLETONS ------------------ */
  singletons: {
    /* GLOBAL SITE CHROME — nav, banner, footer extras, 404 */
    siteGlobal: singleton({
      label: 'Global / Site Chrome',
      path: 'src/content/global/site/',
      format: { data: 'json' },
      schema: {
        nav: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            href:  fields.text({ label: 'Link',  description: 'e.g. /repository', validation: { isRequired: true } }),
          }),
          {
            label: 'Header navigation',
            description: 'Links shown in the top navigation bar.',
            itemLabel: (p) => p.fields.label.value || 'Untitled',
          },
        ),

        bannerEnabled: fields.checkbox({ label: 'Show announcement banner', defaultValue: false }),
        bannerText:    fields.text({ label: 'Banner text', description: 'Shown only if the banner is enabled.' }),
        bannerLink:    fields.text({ label: 'Banner link (optional)', description: 'e.g. /sanguine/peptides' }),

        footerNav: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            href:  fields.text({ label: 'Link', validation: { isRequired: true } }),
          }),
          {
            label: 'Footer links',
            description: 'Optional links shown in the footer.',
            itemLabel: (p) => p.fields.label.value || 'Untitled',
          },
        ),
        footerNote: fields.text({ label: 'Footer note', multiline: true, description: 'Small text in the footer.' }),

        notFoundTitle: fields.text({
          label: '404 — Title',
          defaultValue: 'Page not found',
        }),
        notFoundMessage: fields.text({
          label: '404 — Message',
          multiline: true,
          defaultValue: 'The page you are looking for has moved or never existed. Return home and start again.',
        }),
      },
    }),

    /* GLOBAL THEME / BRAND */
    settings: singleton({
      label: 'Theme & Brand',
      path: 'src/content/settings/site/',
      format: { data: 'json' },
      schema: {
        // Brand
        siteName: fields.text({ label: 'Site name', defaultValue: 'Sanguine' }),
        tagline:  fields.text({
          label: 'Tagline',
          multiline: true,
          defaultValue: 'A repository of inquiry. A practice of vitality.',
        }),
        description: fields.text({
          label: 'Site description (SEO)',
          multiline: true,
          defaultValue:
            'Sanguine is a personal repository of literature and research, paired with practical guidance on peptides, nootropics, and the pursuit of robust health.',
        }),

        // Colors — base 5; deeper variants compute automatically via CSS color-mix
        colorPaper: fields.text({
          label: 'Color — Paper (background)',
          defaultValue: '#F5EFE4',
          description: 'Hex code, e.g. #F5EFE4',
        }),
        colorInk: fields.text({
          label: 'Color — Ink (primary text)',
          defaultValue: '#1F1D17',
        }),
        colorMoss: fields.text({
          label: 'Color — Moss (sage accent)',
          defaultValue: '#7A8B6E',
        }),
        colorBark: fields.text({
          label: 'Color — Bark (warm brown accent)',
          defaultValue: '#7B5E40',
        }),
        colorRule: fields.text({
          label: 'Color — Rule (border lines)',
          defaultValue: '#D4C9B3',
        }),

        // Typography
        fontDisplay: fields.select({
          label: 'Display font (headings)',
          options: [
            { label: 'Fraunces',          value: 'Fraunces' },
            { label: 'Cormorant Garamond', value: 'Cormorant+Garamond' },
            { label: 'EB Garamond',       value: 'EB+Garamond' },
            { label: 'Playfair Display',  value: 'Playfair+Display' },
            { label: 'Crimson Pro',       value: 'Crimson+Pro' },
            { label: 'Lora',              value: 'Lora' },
            { label: 'DM Serif Display',  value: 'DM+Serif+Display' },
            { label: 'Libre Caslon Text', value: 'Libre+Caslon+Text' },
          ],
          defaultValue: 'Fraunces',
        }),
        fontBody: fields.select({
          label: 'Body font (paragraphs)',
          options: [
            { label: 'Manrope',           value: 'Manrope' },
            { label: 'DM Sans',           value: 'DM+Sans' },
            { label: 'Public Sans',       value: 'Public+Sans' },
            { label: 'Outfit',            value: 'Outfit' },
            { label: 'Plus Jakarta Sans', value: 'Plus+Jakarta+Sans' },
            { label: 'Work Sans',         value: 'Work+Sans' },
            { label: 'Inter Tight',       value: 'Inter+Tight' },
            { label: 'Nunito Sans',       value: 'Nunito+Sans' },
          ],
          defaultValue: 'Manrope',
        }),

        // Arabic-capable font (used for right-to-left / Arabic text). Latin
        // display fonts don't include Arabic glyphs, so this is applied
        // wherever dir="rtl" or lang="ar" is set.
        fontArabic: fields.select({
          label: 'Arabic font (for RTL / Arabic text)',
          options: [
            { label: 'Noto Sans Arabic',     value: 'Noto+Sans+Arabic' },
            { label: 'Cairo',                value: 'Cairo' },
            { label: 'IBM Plex Sans Arabic', value: 'IBM+Plex+Sans+Arabic' },
            { label: 'Tajawal',              value: 'Tajawal' },
            { label: 'Noto Kufi Arabic',     value: 'Noto+Kufi+Arabic' },
            { label: 'Amiri (serif)',        value: 'Amiri' },
          ],
          defaultValue: 'Noto+Sans+Arabic',
        }),

        // Typography scale & weight
        baseFontSize: fields.select({
          label: 'Base text size',
          options: [
            { label: 'Small (15px)',   value: '15' },
            { label: 'Default (16px)', value: '16' },
            { label: 'Large (17px)',   value: '17' },
            { label: 'X-Large (18px)', value: '18' },
          ],
          defaultValue: '16',
        }),
        headingWeight: fields.select({
          label: 'Heading weight',
          options: [
            { label: 'As designed', value: 'auto' },
            { label: 'Light (300)',    value: '300' },
            { label: 'Regular (400)',  value: '400' },
            { label: 'Medium (500)',   value: '500' },
            { label: 'Semibold (600)', value: '600' },
          ],
          defaultValue: 'auto',
        }),
        bodyWeight: fields.select({
          label: 'Body text weight',
          options: [
            { label: 'Light (300)',   value: '300' },
            { label: 'Regular (400)', value: '400' },
            { label: 'Medium (500)',  value: '500' },
          ],
          defaultValue: '400',
        }),

        // Spacing
        density: fields.select({
          label: 'Density (whitespace scale)',
          options: [
            { label: 'Compact',  value: 'compact' },
            { label: 'Normal',   value: 'normal' },
            { label: 'Spacious', value: 'spacious' },
          ],
          defaultValue: 'normal',
        }),

        // Layout & surface
        contentWidth: fields.select({
          label: 'Content width',
          options: [
            { label: 'Narrow',   value: 'narrow' },
            { label: 'Standard', value: 'standard' },
            { label: 'Wide',     value: 'wide' },
          ],
          defaultValue: 'standard',
        }),
        cornerRadius: fields.select({
          label: 'Corner rounding',
          options: [
            { label: 'Sharp',   value: 'sharp' },
            { label: 'Soft',    value: 'soft' },
            { label: 'Rounded', value: 'rounded' },
          ],
          defaultValue: 'soft',
        }),
        shadowStrength: fields.select({
          label: 'Shadow strength',
          options: [
            { label: 'None',   value: 'none' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Strong', value: 'strong' },
          ],
          defaultValue: 'subtle',
        }),
        paperGrain: fields.checkbox({
          label: 'Paper grain texture',
          defaultValue: true,
        }),

        // Text direction — groundwork for right-to-left languages (Arabic).
        // Leave as Left-to-right for English/Russian; switch to Right-to-left
        // when the site's primary content is Arabic. The layout mirrors and
        // the Arabic font is applied automatically.
        direction: fields.select({
          label: 'Text direction',
          options: [
            { label: 'Left-to-right (English, Russian)', value: 'ltr' },
            { label: 'Right-to-left (Arabic)',           value: 'rtl' },
          ],
          defaultValue: 'ltr',
        }),

        // Footer
        footerDisclaimer: fields.text({
          label: 'Footer disclaimer',
          multiline: true,
          defaultValue: 'The information here is not medical advice.',
        }),

        // Socials — global, shown in footer (and editable per-page on Contact)
        socials: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform name' }),
            url:      fields.text({ label: 'URL' }),
          }),
          {
            label: 'Footer social links',
            itemLabel: (p) => p.fields.platform.value || 'Untitled',
          },
        ),
      },
    }),

    /* BLOCK-COMPOSED PAGES */
    pageHome: singleton({
      label: 'Page — Home (Landing)',
      path: 'src/content/pages/home/',
      format: { data: 'json' },
      schema: {
        title:         fields.text({ label: 'Browser title', defaultValue: 'Sanguine' }),
        description:   fields.text({
          label: 'SEO description',
          multiline: true,
          defaultValue: 'A repository of inquiry. A practice of vitality.',
        }),
        showHeader:    fields.checkbox({ label: 'Show site header on this page', defaultValue: false }),
        showFooter:    fields.checkbox({ label: 'Show site footer on this page', defaultValue: false }),
        background: fields.object(
          {
            enabled: fields.checkbox({ label: 'Show animated background', defaultValue: true }),
            url: fields.text({
              label: 'Background file path',
              description: 'A self-contained HTML file in public/backgrounds/.',
              defaultValue: '/backgrounds/aurora-mesh.html',
            }),
            scrim: fields.select({
              label: 'Readability scrim',
              description: 'A wash of your paper color over the animation so text stays legible.',
              options: [
                { label: 'None',   value: 'none' },
                { label: 'Light',  value: 'light' },
                { label: 'Medium', value: 'medium' },
                { label: 'Strong', value: 'strong' },
              ],
              defaultValue: 'medium',
            }),
          },
          { label: 'Animated background' },
        ),
        blocks:        pageBlocksField,
      },
    }),

    pageSanguine: singleton({
      label: 'Page — Sanguine (Wellness landing)',
      path: 'src/content/pages/sanguine/',
      format: { data: 'json' },
      schema: {
        title:       fields.text({ label: 'Browser title', defaultValue: 'Sanguine' }),
        description: fields.text({
          label: 'SEO description',
          multiline: true,
          defaultValue: 'Practical guidance on peptides, nootropics, and the pursuit of robust health.',
        }),
        blocks: pageBlocksField,
      },
    }),

    pageContact: singleton({
      label: 'Page — Contact',
      path: 'src/content/pages/contact/',
      format: { data: 'json' },
      schema: {
        title:       fields.text({ label: 'Browser title', defaultValue: 'Contact' }),
        description: fields.text({
          label: 'SEO description',
          multiline: true,
          defaultValue: 'Get in touch.',
        }),
        blocks: pageBlocksField,
      },
    }),
  },

  /* ------------------ COLLECTIONS ------------------ */
  collections: {
    peptides: collection({
      label: 'Peptides',
      slugField: 'title',
      path: 'src/content/peptides/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'category'],
      schema: {
        title:    fields.slug({ name: { label: 'Title' } }),
        summary:  fields.text({ label: 'Summary', multiline: true }),
        category: fields.text({ label: 'Category', validation: { isRequired: false } }),
        aliases:  fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (p) => p.value,
        }),
        publishedAt: fields.date({ label: 'Published', validation: { isRequired: false } }),
        updatedAt:   fields.date({ label: 'Updated',   validation: { isRequired: false } }),
        order:       fields.integer({ label: 'Sort order', validation: { isRequired: false } }),
        draft:       fields.checkbox({ label: 'Draft', defaultValue: false }),
        body: fields.markdoc({
          label: 'Body',
          components: articleComponents,
        }),
      },
    }),

    nootropics: collection({
      label: 'Nootropics',
      slugField: 'title',
      path: 'src/content/nootropics/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'category'],
      schema: {
        title:    fields.slug({ name: { label: 'Title' } }),
        summary:  fields.text({ label: 'Summary', multiline: true }),
        category: fields.text({ label: 'Category', validation: { isRequired: false } }),
        aliases:  fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (p) => p.value,
        }),
        publishedAt: fields.date({ label: 'Published', validation: { isRequired: false } }),
        updatedAt:   fields.date({ label: 'Updated',   validation: { isRequired: false } }),
        order:       fields.integer({ label: 'Sort order', validation: { isRequired: false } }),
        draft:       fields.checkbox({ label: 'Draft', defaultValue: false }),
        body: fields.markdoc({
          label: 'Body',
          components: articleComponents,
        }),
      },
    }),

    repoTopics: collection({
      label: 'Repository · Topics',
      slugField: 'slug',
      path: 'src/content/repo-topics/*',
      format: { data: 'json' },
      columns: ['name', 'order'],
      schema: {
        slug: fields.slug({
          name: { label: 'Slug', description: 'URL segment, e.g. "humanities"' },
        }),
        name:        fields.text({ label: 'Name' }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: false } }),
        order:       fields.integer({ label: 'Sort order', validation: { isRequired: false } }),
      },
    }),

    repoSubtopics: collection({
      label: 'Repository · Subtopics',
      slugField: 'slug',
      path: 'src/content/repo-subtopics/*',
      format: { data: 'json' },
      columns: ['name', 'topic'],
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        name: fields.text({ label: 'Name' }),
        topic: fields.relationship({
          label: 'Parent Topic',
          collection: 'repoTopics',
          validation: { isRequired: true },
        }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: false } }),
        order:       fields.integer({ label: 'Sort order', validation: { isRequired: false } }),
      },
    }),

    repoLinks: collection({
      label: 'Repository · Links',
      slugField: 'title',
      path: 'src/content/repo-links/*',
      format: { data: 'json' },
      columns: ['title', 'topic', 'type'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        url:   fields.url({ label: 'URL' }),
        topic: fields.relationship({
          label: 'Topic',
          collection: 'repoTopics',
          validation: { isRequired: true },
        }),
        subtopic: fields.relationship({
          label: 'Subtopic (optional)',
          collection: 'repoSubtopics',
        }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Article', value: 'Article' },
            { label: 'Study',   value: 'Study' },
            { label: 'Book',    value: 'Book' },
            { label: 'Video',   value: 'Video' },
            { label: 'Podcast', value: 'Podcast' },
            { label: 'Other',   value: 'Other' },
          ],
          defaultValue: 'Article',
        }),
        author:      fields.text({ label: 'Author', validation: { isRequired: false } }),
        year:        fields.integer({ label: 'Year', validation: { isRequired: false } }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: false } }),
        addedAt:     fields.date({ label: 'Added', validation: { isRequired: false } }),
      },
    }),

    presentations: collection({
      label: 'Presentations',
      slugField: 'title',
      path: 'src/content/presentations/*',
      format: { data: 'json' },
      columns: ['title', 'date'],
      schema: {
        title:   fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: false } }),
        date:    fields.date({ label: 'Date', validation: { isRequired: false } }),
        deckFile: fields.file({
          label: 'Deck file (.html)',
          description: 'Upload a self-contained HTML deck. Stored in public/decks/.',
          directory: 'public/decks',
          publicPath: '/decks/',
        }),
        deckUrl: fields.text({
          label: 'Or: deck path / URL',
          description: 'Use this instead if the deck already lives in public/decks (e.g. /decks/talk.html) or is hosted elsewhere.',
          validation: { isRequired: false },
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
      },
    }),
  },
});
