import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

/**
 * Maps the Markdoc tags written by Keystatic's content components
 * (see `body.components` in keystatic.config.tsx) to Astro components
 * that render them. Tag names and attributes must match the schema.
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
    pullQuote: {
      render: component('./src/components/markdoc/PullQuote.astro'),
      attributes: {
        attribution: { type: String },
      },
    },
    figure: {
      render: component('./src/components/markdoc/Figure.astro'),
      attributes: {
        image:   { type: String, required: true },
        alt:     { type: String },
        caption: { type: String },
      },
    },
    video: {
      render: component('./src/components/markdoc/VideoEmbed.astro'),
      attributes: {
        url:   { type: String, required: true },
        title: { type: String },
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
    statsBand: {
      render: component('./src/components/markdoc/StatsBand.astro'),
    },
    stat: {
      render: component('./src/components/markdoc/Stat.astro'),
      attributes: {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    },
    cardGrid: {
      render: component('./src/components/markdoc/CardGrid.astro'),
    },
    card: {
      render: component('./src/components/markdoc/Card.astro'),
      attributes: {
        title:       { type: String, required: true },
        description: { type: String },
        href:        { type: String, required: true },
      },
    },
  },
});
