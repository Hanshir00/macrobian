#!/usr/bin/env node
/**
 * remove-keystatic.js
 * ----------------------------------------------------------
 * Removes Keystatic from this project. Your content (markdown,
 * JSON files in src/content) stays untouched — Keystatic just
 * stops being the editor for it.
 *
 * Run:  npm run remove-keystatic
 * ----------------------------------------------------------
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

console.log('Removing Keystatic from this project…\n');

/* ---- 1. Files to delete ---- */
const filesToRemove = [
  'keystatic.config.tsx',
  'src/pages/admin.astro',
  'src/pages/keystatic',           // directory
  'src/pages/api/keystatic',       // directory
  '.keystatic',
];

filesToRemove.forEach((relPath) => {
  const full = resolve(root, relPath);
  if (existsSync(full)) {
    rmSync(full, { recursive: true, force: true });
    console.log(`  ✓ removed ${relPath}`);
  }
});

/* ---- 2. Strip Keystatic deps from package.json ---- */
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const keystaticDeps = [
  '@keystatic/astro',
  '@keystatic/core',
  '@astrojs/markdoc',
  '@astrojs/react',
  'react',
  'react-dom',
];
const keystaticDevDeps = ['@types/react', '@types/react-dom'];

let removedCount = 0;
keystaticDeps.forEach((d) => {
  if (pkg.dependencies?.[d]) { delete pkg.dependencies[d]; removedCount++; }
});
keystaticDevDeps.forEach((d) => {
  if (pkg.devDependencies?.[d]) { delete pkg.devDependencies[d]; removedCount++; }
});

/* Drop the remove-keystatic script itself */
if (pkg.scripts?.['remove-keystatic']) {
  delete pkg.scripts['remove-keystatic'];
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`  ✓ stripped ${removedCount} dependencies from package.json`);

/* ---- 3. Update astro.config.mjs ---- */
const astroConfigPath = resolve(root, 'astro.config.mjs');
if (existsSync(astroConfigPath)) {
  let cfg = readFileSync(astroConfigPath, 'utf-8');
  cfg = cfg
    .replace(/^import react from '@astrojs\/react';\n?/m, '')
    .replace(/^import markdoc from '@astrojs\/markdoc';\n?/m, '')
    .replace(/^import keystatic from '@keystatic\/astro';\n?/m, '')
    .replace(/\s*react\(\),\n?/g, '\n')
    .replace(/\s*markdoc\(\),\n?/g, '\n')
    .replace(/\s*keystatic\(\),\n?/g, '\n');
  writeFileSync(astroConfigPath, cfg);
  console.log('  ✓ removed integrations from astro.config.mjs');
}

/* ---- 4. Manual follow-up notes ---- */
console.log('\n────────────────────────────────────────────');
console.log('Done.');
console.log('Your content in src/content/ is unchanged — you can edit those');
console.log('files directly in your editor or via GitHub.');
console.log('');
console.log('Manual follow-up:');
console.log('  • Run `rm -rf node_modules package-lock.json && npm install`');
console.log('  • If you no longer need server routes, you can also switch');
console.log('    astro.config.mjs from `output: "server"` to `output: "static"`');
console.log('    and remove the @astrojs/netlify adapter.');
console.log('────────────────────────────────────────────\n');
