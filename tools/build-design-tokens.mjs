#!/usr/bin/env node
// Generates material-overrides/assets/stylesheets/tokens.css from the Polkadot
// app design system, so the docs use the same primitives, semantic colour roles,
// named themes (berlin / tokyo / malta / lisbon, each light + dark) and typescale
// as the app clients.
//
// Inputs (both public):
//   1. @novasamatech/tr-ui  — the web design system the desktop app ships.
//      `npm pack @novasamatech/tr-ui@<version>` then point at package/dist/themes.
//   2. paritytech/polkadot-app-design-system — the Figma token export; only the
//      typescale (source/Typography/Polkadot App Default.json) is read here.
//
// Usage:
//   node tools/build-design-tokens.mjs <tr-ui-dist-themes-dir> <design-system-repo-dir> [out.css]
import fs from 'node:fs';
import path from 'node:path';

const [,, themesDir, dsDir, outArg] = process.argv;
if (!themesDir || !dsDir) { console.error('usage: build-design-tokens.mjs <tr-ui dist/themes> <polkadot-app-design-system dir> [out.css]'); process.exit(1); }
const out = outArg || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'material-overrides', 'assets', 'stylesheets', 'tokens.css');

const { themes, primitives } = await import(path.resolve(themesDir, 'index.mjs'));
const truiPkg = JSON.parse(fs.readFileSync(path.resolve(themesDir, '..', '..', 'package.json'), 'utf8'));
const typo = JSON.parse(fs.readFileSync(path.join(dsDir, 'source', 'Typography', 'Polkadot App Default.json'), 'utf8'));

const THEME_ORDER = ['berlin', 'tokyo', 'malta', 'lisbon'];
const DEFAULT_THEME = 'berlin';
const MODES = { light: 'polkadot-light', dark: 'polkadot-dark' };

const lines = [];
const push = (s = '') => lines.push(s);
push('/* GENERATED FILE — do not edit by hand. Regenerate with tools/build-design-tokens.mjs.');
push(`   Source: @novasamatech/tr-ui@${truiPkg.version} (themes + primitives) and`);
push('   paritytech/polkadot-app-design-system (typescale). These are the same tokens the');
push('   Polkadot app clients use, so the docs inherit the app palette and themes verbatim. */');
push();

// 1. Primitives — the raw palette + scale every theme references.
push('/* --- Primitives (shared by every theme) --------------------------------- */');
push(':root {');
for (const [k, v] of Object.entries(primitives)) push(`  ${k}: ${v};`);
push('}');
push();

// 2. Typescale — role tokens (family / size / line-height / weight / tracking).
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
const refToVar = (ref) => {
  if (typeof ref !== 'string') return ref;
  const m = ref.match(/^\{Typography\.(fontStyle|fontSize|lineHeight|fontWeight)\.(\w+)\}$/);
  if (!m) return ref;
  const [, kind, name] = m;
  if (kind === 'fontStyle') return `var(--font-${name})`;
  if (kind === 'fontSize') return `var(--font-size-${name.replace('fontSize', '')})`;
  if (kind === 'lineHeight') return `var(--line-height-${name.replace('lineHeight', '')})`;
  if (kind === 'fontWeight') return `var(--font-weight-${name})`;
  return ref;
};
push('/* --- Typescale (Polkadot App Default: headings Manrope, body Inter, code Martian Mono) --- */');
push(':root {');
for (const [role, spec] of Object.entries(typo.Typescale)) {
  const r = kebab(role);
  const val = k => spec[k]?.$value;
  if (val('font') !== undefined) push(`  --type-${r}-family: ${refToVar(val('font'))};`);
  if (val('size') !== undefined) push(`  --type-${r}-size: ${refToVar(val('size'))};`);
  if (val('lineHeight') !== undefined) push(`  --type-${r}-line-height: ${refToVar(val('lineHeight'))};`);
  if (val('weight') !== undefined) push(`  --type-${r}-weight: ${refToVar(val('weight'))};`);
  if (val('tracking') !== undefined) push(`  --type-${r}-tracking: ${Number(val('tracking')) / 100}em;`);
}
push('}');
push();

// 3. Theme swatches for the picker (each theme's light primary action colour,
//    exactly what the app's ThemePicker uses as the signature colour).
push('/* --- Theme swatches (what the theme picker shows) ----------------------- */');
push(':root {');
for (const t of THEME_ORDER) push(`  --dg-swatch-${t}: ${themes[t].light['--bg-action-primary']};`);
push('}');
push();

// 4. Semantic colour roles per theme × mode. The named theme is `data-dg-theme`
//    on <html>; the mode is Material's `data-md-color-scheme` (on <body>, and on
//    any element that wants to force a mode locally, e.g. diagrams).
const block = (selector, vars) => { push(`${selector} {`); for (const [k, v] of Object.entries(vars)) push(`  ${k}: ${v};`); push('}'); push(); };
for (const t of THEME_ORDER) {
  push(`/* --- Theme: ${t}${t === DEFAULT_THEME ? ' (default)' : ''} --------------------------------------------- */`);
  for (const [mode, scheme] of Object.entries(MODES)) {
    const vars = themes[t][mode];
    const sel = [`[data-dg-theme="${t}"] [data-md-color-scheme="${scheme}"]`];
    if (t === DEFAULT_THEME) sel.unshift(`[data-md-color-scheme="${scheme}"]`);
    block(sel.join(',\n'), vars);
  }
}
fs.writeFileSync(out, lines.join('\n'));
console.log(`wrote ${out} (${lines.length} lines, ${THEME_ORDER.length} themes × ${Object.keys(MODES).length} modes)`);
