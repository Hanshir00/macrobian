/**
 * Sanguine — Keystatic config.
 * Each content collection is defined independently (no shared blueprint), so
 * editing one never affects another. They all publish at /<slug>.
 */
import { config, fields, singleton, collection } from '@keystatic/core';
import { wrapper, block, repeating } from '@keystatic/core/content-components';

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : ({ kind: 'cloud' } as const);

export default config({
  storage,
  cloud: { project: 'sanguinebio/sanguine' },

  ui: {
    brand: { name: 'Sanguine' },
    navigation: {
      'Global': ['landing'],
      'Collections': ['pages', 'repository', 'products', 'other'],
    },
  },

  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'body' },
      columns: ['title'],
      entryLayout: 'content',
      // Publishes at /<slug> via src/pages/[...slug].astro.
      previewUrl: '/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'The entry lives at /<slug> — for example "aspirin" becomes /aspirin.',
          },
        }),
        intro: fields.text({
          label: 'Intro / subtitle',
          description: 'Optional line shown under the title.',
          multiline: true,
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/images/gallery',
            publicPath: '/images/gallery/',
          }),
          { label: 'Gallery', itemLabel: (props) => props.value || 'Image' },
        ),
        textSize: fields.select({
          label: 'Body text size',
          description: 'Scales only the body text on this entry. Default matches the normal size.',
          options: [
            { label: 'Extra small', value: '0.85' },
            { label: 'Small',       value: '0.92' },
            { label: 'Default',     value: '1' },
            { label: 'Large',       value: '1.1' },
            { label: 'Extra large', value: '1.2' },
          ],
          defaultValue: '1',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: { directory: 'public/images/content', publicPath: '/images/content/' },
          },
          components: {
            /* 1. Callout — info/tip/warning box wrapping rich text */
            callout: wrapper({
              label: 'Callout',
              description: 'A highlighted note box.',
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { label: 'Info',    value: 'info' },
                    { label: 'Tip',     value: 'tip' },
                    { label: 'Warning', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
                title: fields.text({ label: 'Title (optional)' }),
              },
            }),

            /* 2. Pull quote — large styled blockquote with attribution */
            pullQuote: wrapper({
              label: 'Pull quote',
              description: 'A large styled quote. Write the quote inside.',
              schema: {
                attribution: fields.text({ label: 'Attribution (optional)' }),
              },
            }),

            /* 3. Figure — uploaded image with caption */
            figure: block({
              label: 'Figure',
              description: 'An image with a caption.',
              schema: {
                image: fields.image({
                  label: 'Image',
                  directory: 'public/images/figures',
                  publicPath: '/images/figures/',
                  validation: { isRequired: true },
                }),
                alt:     fields.text({ label: 'Alt text (for accessibility)' }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),

            /* 4. Video embed — YouTube or Vimeo URL */
            video: block({
              label: 'Video embed',
              description: 'Paste a YouTube or Vimeo URL.',
              schema: {
                url:   fields.text({ label: 'URL', description: 'YouTube or Vimeo link.', validation: { isRequired: true } }),
                title: fields.text({ label: 'Title (for accessibility)' }),
              },
            }),

            /* 5. Citation — a structured reference card */
            citation: block({
              label: 'Citation',
              description: 'A formatted reference.',
              schema: {
                authors: fields.text({ label: 'Authors' }),
                title:   fields.text({ label: 'Title' }),
                source:  fields.text({ label: 'Journal / source' }),
                year:    fields.text({ label: 'Year' }),
                url:     fields.text({ label: 'URL (optional)' }),
              },
            }),

            /* 6. Stats band — a row of big numbers (insert 'stat' items inside) */
            statsBand: repeating({
              label: 'Stats band',
              description: 'A row of big numbers. Insert "Stat" items inside.',
              children: ['stat'],
              schema: {},
            }),
            stat: block({
              label: 'Stat',
              description: 'One stat (big value + small label).',
              schema: {
                value: fields.text({ label: 'Value (big number)', validation: { isRequired: true } }),
                label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              },
            }),

            /* 7. Card grid — small cards (insert 'card' items inside) */
            cardGrid: repeating({
              label: 'Card grid',
              description: 'Small cards for further reading. Insert "Card" items inside.',
              children: ['card'],
              schema: {},
            }),
            card: block({
              label: 'Card',
              description: 'A small card with a title, one-line description, and link.',
              schema: {
                title:       fields.text({ label: 'Title',       validation: { isRequired: true } }),
                description: fields.text({ label: 'Description', multiline: true }),
                href:        fields.text({ label: 'Link',        validation: { isRequired: true } }),
              },
            }),

            /* 8. Interactive tool — embed a self-contained .html file from public/tools */
            tool: block({
              label: 'Interactive tool (HTML embed)',
              description: 'Embed a self-contained .html tool from /public/tools.',
              schema: {
                src: fields.text({
                  label: 'Source path',
                  description: 'Path under /public, e.g. /tools/peptide-calculator/ (keep the trailing slash).',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'Interactive tool',
                }),
                minHeight: fields.integer({
                  label: 'Minimum height (px)',
                  description: 'Fallback height before or if the content cannot be measured.',
                  defaultValue: 320,
                }),
              },
            }),

            /* 9. PDF viewer — embed a PDF inline from public/files (native browser embed) */
            pdf: block({
              label: 'PDF viewer',
              description: 'Embed a PDF inline from /public/files. Solid on desktop; on mobile it falls back to an open/download link.',
              schema: {
                src: fields.text({
                  label: 'PDF path',
                  description: 'Path under /public, e.g. /files/paper.pdf',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'PDF document',
                }),
                height: fields.integer({
                  label: 'Viewer height (px)',
                  defaultValue: 640,
                }),
              },
            }),
          },
        }),
      },
    }),

    repository: collection({
      label: 'Repository',
      slugField: 'title',
      path: 'src/content/repository/*',
      format: { contentField: 'body' },
      columns: ['title'],
      entryLayout: 'content',
      // Publishes at /<slug> via src/pages/[...slug].astro.
      previewUrl: '/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'The entry lives at /<slug> — for example "aspirin" becomes /aspirin.',
          },
        }),
        intro: fields.text({
          label: 'Intro / subtitle',
          description: 'Optional line shown under the title.',
          multiline: true,
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/images/gallery',
            publicPath: '/images/gallery/',
          }),
          { label: 'Gallery', itemLabel: (props) => props.value || 'Image' },
        ),
        textSize: fields.select({
          label: 'Body text size',
          description: 'Scales only the body text on this entry. Default matches the normal size.',
          options: [
            { label: 'Extra small', value: '0.85' },
            { label: 'Small',       value: '0.92' },
            { label: 'Default',     value: '1' },
            { label: 'Large',       value: '1.1' },
            { label: 'Extra large', value: '1.2' },
          ],
          defaultValue: '1',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: { directory: 'public/images/content', publicPath: '/images/content/' },
          },
          components: {
            /* 1. Callout — info/tip/warning box wrapping rich text */
            callout: wrapper({
              label: 'Callout',
              description: 'A highlighted note box.',
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { label: 'Info',    value: 'info' },
                    { label: 'Tip',     value: 'tip' },
                    { label: 'Warning', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
                title: fields.text({ label: 'Title (optional)' }),
              },
            }),

            /* 2. Pull quote — large styled blockquote with attribution */
            pullQuote: wrapper({
              label: 'Pull quote',
              description: 'A large styled quote. Write the quote inside.',
              schema: {
                attribution: fields.text({ label: 'Attribution (optional)' }),
              },
            }),

            /* 3. Figure — uploaded image with caption */
            figure: block({
              label: 'Figure',
              description: 'An image with a caption.',
              schema: {
                image: fields.image({
                  label: 'Image',
                  directory: 'public/images/figures',
                  publicPath: '/images/figures/',
                  validation: { isRequired: true },
                }),
                alt:     fields.text({ label: 'Alt text (for accessibility)' }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),

            /* 4. Video embed — YouTube or Vimeo URL */
            video: block({
              label: 'Video embed',
              description: 'Paste a YouTube or Vimeo URL.',
              schema: {
                url:   fields.text({ label: 'URL', description: 'YouTube or Vimeo link.', validation: { isRequired: true } }),
                title: fields.text({ label: 'Title (for accessibility)' }),
              },
            }),

            /* 5. Citation — a structured reference card */
            citation: block({
              label: 'Citation',
              description: 'A formatted reference.',
              schema: {
                authors: fields.text({ label: 'Authors' }),
                title:   fields.text({ label: 'Title' }),
                source:  fields.text({ label: 'Journal / source' }),
                year:    fields.text({ label: 'Year' }),
                url:     fields.text({ label: 'URL (optional)' }),
              },
            }),

            /* 6. Stats band — a row of big numbers (insert 'stat' items inside) */
            statsBand: repeating({
              label: 'Stats band',
              description: 'A row of big numbers. Insert "Stat" items inside.',
              children: ['stat'],
              schema: {},
            }),
            stat: block({
              label: 'Stat',
              description: 'One stat (big value + small label).',
              schema: {
                value: fields.text({ label: 'Value (big number)', validation: { isRequired: true } }),
                label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              },
            }),

            /* 7. Card grid — small cards (insert 'card' items inside) */
            cardGrid: repeating({
              label: 'Card grid',
              description: 'Small cards for further reading. Insert "Card" items inside.',
              children: ['card'],
              schema: {},
            }),
            card: block({
              label: 'Card',
              description: 'A small card with a title, one-line description, and link.',
              schema: {
                title:       fields.text({ label: 'Title',       validation: { isRequired: true } }),
                description: fields.text({ label: 'Description', multiline: true }),
                href:        fields.text({ label: 'Link',        validation: { isRequired: true } }),
              },
            }),

            /* 8. Interactive tool — embed a self-contained .html file from public/tools */
            tool: block({
              label: 'Interactive tool (HTML embed)',
              description: 'Embed a self-contained .html tool from /public/tools.',
              schema: {
                src: fields.text({
                  label: 'Source path',
                  description: 'Path under /public, e.g. /tools/peptide-calculator/ (keep the trailing slash).',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'Interactive tool',
                }),
                minHeight: fields.integer({
                  label: 'Minimum height (px)',
                  description: 'Fallback height before or if the content cannot be measured.',
                  defaultValue: 320,
                }),
              },
            }),

            /* 9. PDF viewer — embed a PDF inline from public/files (native browser embed) */
            pdf: block({
              label: 'PDF viewer',
              description: 'Embed a PDF inline from /public/files. Solid on desktop; on mobile it falls back to an open/download link.',
              schema: {
                src: fields.text({
                  label: 'PDF path',
                  description: 'Path under /public, e.g. /files/paper.pdf',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'PDF document',
                }),
                height: fields.integer({
                  label: 'Viewer height (px)',
                  defaultValue: 640,
                }),
              },
            }),
          },
        }),
      },
    }),

    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'body' },
      columns: ['title'],
      entryLayout: 'content',
      // Publishes at /<slug> via src/pages/[...slug].astro.
      previewUrl: '/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'The entry lives at /<slug> — for example "aspirin" becomes /aspirin.',
          },
        }),
        intro: fields.text({
          label: 'Intro / subtitle',
          description: 'Optional line shown under the title.',
          multiline: true,
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/images/gallery',
            publicPath: '/images/gallery/',
          }),
          { label: 'Gallery', itemLabel: (props) => props.value || 'Image' },
        ),
        textSize: fields.select({
          label: 'Body text size',
          description: 'Scales only the body text on this entry. Default matches the normal size.',
          options: [
            { label: 'Extra small', value: '0.85' },
            { label: 'Small',       value: '0.92' },
            { label: 'Default',     value: '1' },
            { label: 'Large',       value: '1.1' },
            { label: 'Extra large', value: '1.2' },
          ],
          defaultValue: '1',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: { directory: 'public/images/content', publicPath: '/images/content/' },
          },
          components: {
            /* 1. Callout — info/tip/warning box wrapping rich text */
            callout: wrapper({
              label: 'Callout',
              description: 'A highlighted note box.',
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { label: 'Info',    value: 'info' },
                    { label: 'Tip',     value: 'tip' },
                    { label: 'Warning', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
                title: fields.text({ label: 'Title (optional)' }),
              },
            }),

            /* 2. Pull quote — large styled blockquote with attribution */
            pullQuote: wrapper({
              label: 'Pull quote',
              description: 'A large styled quote. Write the quote inside.',
              schema: {
                attribution: fields.text({ label: 'Attribution (optional)' }),
              },
            }),

            /* 3. Figure — uploaded image with caption */
            figure: block({
              label: 'Figure',
              description: 'An image with a caption.',
              schema: {
                image: fields.image({
                  label: 'Image',
                  directory: 'public/images/figures',
                  publicPath: '/images/figures/',
                  validation: { isRequired: true },
                }),
                alt:     fields.text({ label: 'Alt text (for accessibility)' }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),

            /* 4. Video embed — YouTube or Vimeo URL */
            video: block({
              label: 'Video embed',
              description: 'Paste a YouTube or Vimeo URL.',
              schema: {
                url:   fields.text({ label: 'URL', description: 'YouTube or Vimeo link.', validation: { isRequired: true } }),
                title: fields.text({ label: 'Title (for accessibility)' }),
              },
            }),

            /* 5. Citation — a structured reference card */
            citation: block({
              label: 'Citation',
              description: 'A formatted reference.',
              schema: {
                authors: fields.text({ label: 'Authors' }),
                title:   fields.text({ label: 'Title' }),
                source:  fields.text({ label: 'Journal / source' }),
                year:    fields.text({ label: 'Year' }),
                url:     fields.text({ label: 'URL (optional)' }),
              },
            }),

            /* 6. Stats band — a row of big numbers (insert 'stat' items inside) */
            statsBand: repeating({
              label: 'Stats band',
              description: 'A row of big numbers. Insert "Stat" items inside.',
              children: ['stat'],
              schema: {},
            }),
            stat: block({
              label: 'Stat',
              description: 'One stat (big value + small label).',
              schema: {
                value: fields.text({ label: 'Value (big number)', validation: { isRequired: true } }),
                label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              },
            }),

            /* 7. Card grid — small cards (insert 'card' items inside) */
            cardGrid: repeating({
              label: 'Card grid',
              description: 'Small cards for further reading. Insert "Card" items inside.',
              children: ['card'],
              schema: {},
            }),
            card: block({
              label: 'Card',
              description: 'A small card with a title, one-line description, and link.',
              schema: {
                title:       fields.text({ label: 'Title',       validation: { isRequired: true } }),
                description: fields.text({ label: 'Description', multiline: true }),
                href:        fields.text({ label: 'Link',        validation: { isRequired: true } }),
              },
            }),

            /* 8. Interactive tool — embed a self-contained .html file from public/tools */
            tool: block({
              label: 'Interactive tool (HTML embed)',
              description: 'Embed a self-contained .html tool from /public/tools.',
              schema: {
                src: fields.text({
                  label: 'Source path',
                  description: 'Path under /public, e.g. /tools/peptide-calculator/ (keep the trailing slash).',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'Interactive tool',
                }),
                minHeight: fields.integer({
                  label: 'Minimum height (px)',
                  description: 'Fallback height before or if the content cannot be measured.',
                  defaultValue: 320,
                }),
              },
            }),

            /* 9. PDF viewer — embed a PDF inline from public/files (native browser embed) */
            pdf: block({
              label: 'PDF viewer',
              description: 'Embed a PDF inline from /public/files. Solid on desktop; on mobile it falls back to an open/download link.',
              schema: {
                src: fields.text({
                  label: 'PDF path',
                  description: 'Path under /public, e.g. /files/paper.pdf',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'PDF document',
                }),
                height: fields.integer({
                  label: 'Viewer height (px)',
                  defaultValue: 640,
                }),
              },
            }),
          },
        }),
      },
    }),


    other: collection({
      label: 'Other',
      slugField: 'title',
      path: 'src/content/other/*',
      format: { contentField: 'body' },
      columns: ['title'],
      entryLayout: 'content',
      // Publishes at /<slug> via src/pages/[...slug].astro.
      previewUrl: '/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'The entry lives at /<slug> — for example "aspirin" becomes /aspirin.',
          },
        }),
        intro: fields.text({
          label: 'Intro / subtitle',
          description: 'Optional line shown under the title.',
          multiline: true,
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/images/gallery',
            publicPath: '/images/gallery/',
          }),
          { label: 'Gallery', itemLabel: (props) => props.value || 'Image' },
        ),
        textSize: fields.select({
          label: 'Body text size',
          description: 'Scales only the body text on this entry. Default matches the normal size.',
          options: [
            { label: 'Extra small', value: '0.85' },
            { label: 'Small',       value: '0.92' },
            { label: 'Default',     value: '1' },
            { label: 'Large',       value: '1.1' },
            { label: 'Extra large', value: '1.2' },
          ],
          defaultValue: '1',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: { directory: 'public/images/content', publicPath: '/images/content/' },
          },
          components: {
            /* 1. Callout — info/tip/warning box wrapping rich text */
            callout: wrapper({
              label: 'Callout',
              description: 'A highlighted note box.',
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { label: 'Info',    value: 'info' },
                    { label: 'Tip',     value: 'tip' },
                    { label: 'Warning', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
                title: fields.text({ label: 'Title (optional)' }),
              },
            }),

            /* 2. Pull quote — large styled blockquote with attribution */
            pullQuote: wrapper({
              label: 'Pull quote',
              description: 'A large styled quote. Write the quote inside.',
              schema: {
                attribution: fields.text({ label: 'Attribution (optional)' }),
              },
            }),

            /* 3. Figure — uploaded image with caption */
            figure: block({
              label: 'Figure',
              description: 'An image with a caption.',
              schema: {
                image: fields.image({
                  label: 'Image',
                  directory: 'public/images/figures',
                  publicPath: '/images/figures/',
                  validation: { isRequired: true },
                }),
                alt:     fields.text({ label: 'Alt text (for accessibility)' }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),

            /* 4. Video embed — YouTube or Vimeo URL */
            video: block({
              label: 'Video embed',
              description: 'Paste a YouTube or Vimeo URL.',
              schema: {
                url:   fields.text({ label: 'URL', description: 'YouTube or Vimeo link.', validation: { isRequired: true } }),
                title: fields.text({ label: 'Title (for accessibility)' }),
              },
            }),

            /* 5. Citation — a structured reference card */
            citation: block({
              label: 'Citation',
              description: 'A formatted reference.',
              schema: {
                authors: fields.text({ label: 'Authors' }),
                title:   fields.text({ label: 'Title' }),
                source:  fields.text({ label: 'Journal / source' }),
                year:    fields.text({ label: 'Year' }),
                url:     fields.text({ label: 'URL (optional)' }),
              },
            }),

            /* 6. Stats band — a row of big numbers (insert 'stat' items inside) */
            statsBand: repeating({
              label: 'Stats band',
              description: 'A row of big numbers. Insert "Stat" items inside.',
              children: ['stat'],
              schema: {},
            }),
            stat: block({
              label: 'Stat',
              description: 'One stat (big value + small label).',
              schema: {
                value: fields.text({ label: 'Value (big number)', validation: { isRequired: true } }),
                label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              },
            }),

            /* 7. Card grid — small cards (insert 'card' items inside) */
            cardGrid: repeating({
              label: 'Card grid',
              description: 'Small cards for further reading. Insert "Card" items inside.',
              children: ['card'],
              schema: {},
            }),
            card: block({
              label: 'Card',
              description: 'A small card with a title, one-line description, and link.',
              schema: {
                title:       fields.text({ label: 'Title',       validation: { isRequired: true } }),
                description: fields.text({ label: 'Description', multiline: true }),
                href:        fields.text({ label: 'Link',        validation: { isRequired: true } }),
              },
            }),

            /* 8. Interactive tool — embed a self-contained .html file from public/tools */
            tool: block({
              label: 'Interactive tool (HTML embed)',
              description: 'Embed a self-contained .html tool from /public/tools.',
              schema: {
                src: fields.text({
                  label: 'Source path',
                  description: 'Path under /public, e.g. /tools/peptide-calculator/ (keep the trailing slash).',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'Interactive tool',
                }),
                minHeight: fields.integer({
                  label: 'Minimum height (px)',
                  description: 'Fallback height before or if the content cannot be measured.',
                  defaultValue: 320,
                }),
              },
            }),

            /* 9. PDF viewer — embed a PDF inline from public/files (native browser embed) */
            pdf: block({
              label: 'PDF viewer',
              description: 'Embed a PDF inline from /public/files. Solid on desktop; on mobile it falls back to an open/download link.',
              schema: {
                src: fields.text({
                  label: 'PDF path',
                  description: 'Path under /public, e.g. /files/paper.pdf',
                  validation: { isRequired: true },
                }),
                title: fields.text({
                  label: 'Title (for accessibility)',
                  defaultValue: 'PDF document',
                }),
                height: fields.integer({
                  label: 'Viewer height (px)',
                  defaultValue: 640,
                }),
              },
            }),
          },
        }),
      },
    }),
  },

  singletons: {
    landing: singleton({
      label: 'Landing Page',
      path: 'src/content/landing/',
      format: { data: 'json' },
      // PREVIEW: the landing renders at the site root, so preview opens "/".
      previewUrl: '/',
      schema: {
        /* ---- Top bar ---- */
        brandName:    fields.text({ label: 'Brand name', defaultValue: 'SANGUINE' }),
        brandVersion: fields.text({ label: 'Brand version tag', defaultValue: 'V.01' }),
        nav: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            href:  fields.text({ label: 'Link', defaultValue: '#' }),
          }),
          { label: 'Top navigation', itemLabel: (p) => p.fields.label.value || 'Item' },
        ),

        /* ---- Left rail (technical readout) ---- */
        railAperture:  fields.text({ label: 'Rail — aperture label', defaultValue: 'APERTURE · C' }),
        railDiameter:  fields.text({ label: 'Rail — diameter', defaultValue: 'Ø 412 MM' }),
        railTolerance: fields.text({ label: 'Rail — tolerance', defaultValue: '±0.02' }),
        railRev:       fields.text({ label: 'Rail — revision', defaultValue: 'REV 04' }),

        /* ---- Red spine ---- */
        spineText:   fields.text({ label: 'Spine text (vertical)', defaultValue: 'SANGUINE · SYSTEM 01 · BUILD 24.05' }),
        spineNumber: fields.text({ label: 'Spine number', defaultValue: '04' }),

        /* ---- Hero ---- */
        eyebrowLeft:  fields.text({ label: 'Eyebrow — left', defaultValue: 'A HEALTH INSTRUMENT' }),
        eyebrowRight: fields.text({ label: 'Eyebrow — right', defaultValue: 'BUILT FOR CLINICIANS' }),
        title:        fields.text({ label: 'Title (large wordmark)', defaultValue: 'Sanguine' }),
        description:  fields.text({
          label: 'Description',
          multiline: true,
          defaultValue:
            'Continuous vital-sign measurement, reduced to the few numbers that decide care. No noise, no dashboards — a calibrated instrument for the people reading the body.',
        }),
        primaryLabel:   fields.text({ label: 'Primary button — label', defaultValue: 'REQUEST ACCESS' }),
        primaryHref:    fields.text({ label: 'Primary button — link', defaultValue: '#' }),
        secondaryLabel: fields.text({ label: 'Secondary link — label', defaultValue: 'READ THE METHOD' }),
        secondaryHref:  fields.text({ label: 'Secondary link — link', defaultValue: '#' }),

        /* ---- Footer plate ---- */
        footerLeft:   fields.text({ label: 'Footer — left', defaultValue: 'APERTURE · C' }),
        footerCenter: fields.text({ label: 'Footer — center', defaultValue: 'PLATE 03 / 04 · 2026-05-28' }),
        footerRight:  fields.text({ label: 'Footer — right', defaultValue: 'BERLIN / NYC' }),

        /* ---- Theme (colors + fonts) ---- */
        theme: fields.object(
          {
            colorBgLight: fields.text({ label: 'Background — light corner', defaultValue: '#EEECE8' }),
            colorBgDark:  fields.text({ label: 'Background — dark corner', defaultValue: '#D5D2CB' }),
            colorInk:     fields.text({ label: 'Ink (text)', defaultValue: '#171716' }),
            colorMuted:   fields.text({ label: 'Muted (labels)', defaultValue: '#8C8C86' }),
            colorAccent:  fields.text({ label: 'Accent (the red)', defaultValue: '#DA3A2C' }),
            fontDisplay: fields.select({
              label: 'Display font (wordmark + body)',
              options: [
                { label: 'Inter',          value: 'Inter' },
                { label: 'Archivo',        value: 'Archivo' },
                { label: 'Hanken Grotesk', value: 'Hanken+Grotesk' },
                { label: 'Schibsted Grotesk', value: 'Schibsted+Grotesk' },
                { label: 'Figtree',        value: 'Figtree' },
                { label: 'Manrope',        value: 'Manrope' },
              ],
              defaultValue: 'Inter',
            }),
            fontMono: fields.select({
              label: 'Mono font (technical labels)',
              options: [
                { label: 'JetBrains Mono', value: 'JetBrains+Mono' },
                { label: 'Space Mono',     value: 'Space+Mono' },
                { label: 'IBM Plex Mono',  value: 'IBM+Plex+Mono' },
                { label: 'DM Mono',        value: 'DM+Mono' },
                { label: 'Martian Mono',   value: 'Martian+Mono' },
              ],
              defaultValue: 'JetBrains+Mono',
            }),
            typeScale: fields.select({
              label: 'Text size (whole page)',
              description: 'Scales all landing text proportionally. Default matches the original sizing.',
              options: [
                { label: 'Extra small', value: '0.85' },
                { label: 'Small',       value: '0.92' },
                { label: 'Default',     value: '1' },
                { label: 'Large',       value: '1.1' },
                { label: 'Extra large', value: '1.2' },
              ],
              defaultValue: '1',
            }),
          },
          { label: 'Theme (colors, fonts & text size)' },
        ),
      },
    }),
  },
});
