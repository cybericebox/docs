// Checks the release pages the way infrastructure/release/release_line.py reads them (split_page + notes):
// every required section is there and not empty, and nothing else is claimed. Also checks the brand spelling.
//
//   node scripts/check-releases.mjs [path ...]     default: src/content/docs/releases and templates/
//
// A path is a release page or a directory searched for pages `<product>/<X.Y>.md` (the template is checked as a platform page).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

// Same names and order as PRODUCTS in release_line.py.
const SECTIONS = {
  laboratory: ['Laboratory'],
  brain: ['API', 'Brain'],
  platform: ['Backend', 'ID', 'Platform panel', 'Task catalog', 'Event site', 'Landing'],
};
const REQUIRES = new Set(['platform']);

// Same as split_page(): `## ` lines (no fence awareness) split the text; text before the first is under ''.
function splitPage(text) {
  const parts = new Map();
  let name = '';
  let buf = [];
  for (const row of text.split(/\r?\n/)) {
    if (row.startsWith('## ')) {
      parts.set(name, [...(parts.get(name) ?? []), buf.join('\n').trim()]);
      name = row.slice(3).trim();
      buf = [];
    } else buf.push(row);
  }
  parts.set(name, [...(parts.get(name) ?? []), buf.join('\n').trim()]);
  return parts;
}

function stripFrontmatter(text) {
  const m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return m ? text.slice(m[0].length) : text;
}

function walk(path, out) {
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path).sort()) walk(join(path, f), out);
  } else if (/\.mdx?$/.test(path)) out.push(path);
}

function checkPage(file, product) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  // The slug keeps the dot of X.Y in the address (the default slug drops it), and the tool links to /releases/<product>/<X.Y>.
  const expected = `releases/${product}/${basename(file).replace(/\.mdx?$/, '')}`;
  if (!file.includes('templates') && !new RegExp(`^slug:\\s*${expected.replace('.', '\\.')}\\s*$`, 'm').test(raw.split('\n---')[0]))
    errors.push(`frontmatter needs slug: ${expected}`);
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) errors.push('no frontmatter (title is required)');
  else if (!/^title:\s*\S/m.test(raw.slice(0, raw.indexOf('\n---', 4)))) errors.push('frontmatter has no title');
  const parts = splitPage(stripFrontmatter(raw));
  if (!parts.get('')[0]) errors.push('no introduction before the first `## ` section');
  for (const [name, bodies] of parts) {
    if (name && bodies.length > 1) errors.push(`section "${name}" appears ${bodies.length} times`);
  }
  const required = [...(REQUIRES.has(product) ? ['Requires'] : []), ...SECTIONS[product]];
  for (const s of required) {
    if (!parts.has(s)) errors.push(`missing section "${s}"`);
    else if (!parts.get(s)[0]) errors.push(`section "${s}" is empty`);
  }
  return errors;
}

const roots = process.argv.slice(2);
if (roots.length === 0) roots.push('src/content/docs/releases', 'templates');
const files = [];
for (const r of roots) walk(r, files);

let failed = 0;
let checked = 0;
for (const file of files) {
  const name = basename(file);
  const isTemplate = file.split('/').includes('templates');
  if (name === 'index.md' || name === 'index.mdx') continue;
  let product = basename(dirname(file));
  if (isTemplate) product = 'platform';
  else if (!/^\d+\.\d+\.mdx?$/.test(name)) {
    console.error(`FAIL ${file}: a release page is named <X.Y>.md`);
    failed++;
    continue;
  }
  if (!SECTIONS[product]) {
    console.error(`FAIL ${file}: unknown product "${product}" (one of: ${Object.keys(SECTIONS).join(', ')})`);
    failed++;
    continue;
  }
  checked++;
  const errors = checkPage(file, product);
  if (errors.length) {
    failed++;
    for (const e of errors) console.error(`FAIL ${file}: ${e}`);
  } else console.log(`ok   ${file}`);
}

// The brand name never wraps: "Cyber ICE Box" with ordinary spaces is an error in content.
const content = [];
walk('src/content/docs', content);
for (const file of content) {
  if (/Cyber ICE Box/.test(readFileSync(file, 'utf8'))) {
    console.error(`FAIL ${file}: write the brand as Cyber&nbsp;ICE&nbsp;Box (non-breaking spaces)`);
    failed++;
  }
}

if (checked === 0) {
  console.error('FAIL: no release page found');
  failed++;
}
if (failed) {
  console.error(`${failed} problem(s)`);
  process.exit(1);
}
console.log(`${checked} release page(s) checked`);
