/**
 * Sanguine — Keystatic config (bare-bones landing).
 * One singleton: the landing page. Everything on the page is editable here.
 */
import { config, fields, singleton, collection } from '@keystatic/core';

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : ({ kind: 'cloud' } as const);

export default config({
  storage,
  cloud: { project: 'sanguinebio/sanguine' },

  ui: {
    brand: { name: 'Sanguine' },
    navigation: {
      'Site': ['landing'],
      'Pages': ['pages'],
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
      schema: {
        title: fields.slug({
          name: { label: 'Page title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'The page will live at /<slug> — e.g. "method" → /method.',
          },
        }),
        intro: fields.text({
          label: 'Intro / subtitle',
          description: 'Optional line shown under the title.',
          multiline: true,
        }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },

  singletons: {
    landing: singleton({
      label: 'Landing Page',
      path: 'src/content/landing/',
      format: { data: 'json' },
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
          },
          { label: 'Theme (colors & fonts)' },
        ),
      },
    }),
  },
});
