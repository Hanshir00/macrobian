import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

/**
 * Maps the Markdoc tags written by Keystatic's content components
 * (see `articleComponents` in keystatic.config.tsx) to Astro components
 * that render them. Tag names and attributes must match the Keystatic
 * component keys and their schema field names.
 */
export default defineMarkdocConfig({
  tags: {
    callout: {
      render: component('./src/components/markdoc/Callout.astro'),
      attributes: {
        tone:  { type: String, default: 'info' },
        title: { type: String },
      },
    },
    warning: {
      render: component('./src/components/markdoc/Warning.astro'),
      attributes: {
        title: { type: String, default: 'Caution' },
      },
    },
    dosage: {
      render: component('./src/components/markdoc/Dosage.astro'),
      attributes: {
        amount:    { type: String },
        frequency: { type: String },
        route:     { type: String },
        notes:     { type: String },
      },
    },
    citation: {
      render: component('./src/components/markdoc/Citation.astro'),
      attributes: {
        authors: { type: String },
        title:   { type: String },
        source:  { type: String },
        year:    { type: String },
        url:     { type: String },
      },
    },
  },
});
