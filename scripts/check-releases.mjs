// Checks the release pages.
//
// English pages (src/content/docs/en/releases/<product>/<X.Y>.md) are the source of infrastructure/release/release_line.py
// (split_page + notes): they must have every required section, not empty, with the exact English headings.
// Ukrainian pages (src/content/docs/releases/...) are their translations: the same structure with the Ukrainian headings,
// and every page exists in both languages. The two templates (templates/en, templates/uk) are checked as platform pages.
// Also checks the brand spelling in the content.
//
//   node scripts/check-releases.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const EN_ROOT = 'src/content/docs/en/releases';
const UK_ROOT = 'src/content/docs/releases';
const NO_CHANGES = { en: 'No changes in this repository.', uk: 'Без змін у цьому репозиторії.' };

// English names and order: PRODUCTS in release_line.py. Ukrainian: the same sections, translated.
const SECTIONS = {
  laboratory: { en: ['Laboratory'], uk: ['Лабораторія'] },
  brain: { en: ['API', 'Brain'], uk: ['API', 'Brain'] },
  platform: {
    en: ['Backend', 'ID', 'Platform panel', 'Task catalog', 'Event site', 'Landing'],
    uk: ['Бекенд', 'ID', 'Панель платформи', 'Каталог завдань', 'Сайт заходу', 'Лендінг'],
  },
};
const REQUIRES = { en: 'Requires', uk: 'Вимоги' };

// Same as split_page(): `## ` lines (no fence awareness) split the text; text before the first is under ''.
// Returns [[heading, body], ...] in order.
function splitPage(text) {
  const parts = [];
  let name = '';
  let buf = [];
  for (const row of text.split(/\r?\n/)) {
    if (row.startsWith('## ')) {
      parts.push([name, buf.join('\n').trim()]);
      name = row.slice(3).trim();
      buf = [];
    } else buf.push(row);
  }
  parts.push([name, buf.join('\n').trim()]);
  return parts;
}

function frontmatterOf(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return m ? { front: m[1], body: text.slice(m[0].length) } : null;
}

function walk(path, out) {
  if (!existsSync(path)) return out;
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path).sort()) walk(join(path, f), out);
  } else if (/\.mdx?$/.test(path)) out.push(path);
  return out;
}

function checkPage(file, lang, product, slug) {
  const errors = [];
  const fm = frontmatterOf(readFileSync(file, 'utf8'));
  if (!fm) return ['no frontmatter (title is required)'];
  if (!/^title:\s*\S/m.test(fm.front)) errors.push('frontmatter has no title');
  // The slug keeps the dot of X.Y in the address (the default slug drops it); the tool links to /releases/<product>/<X.Y>.
  if (slug && !new RegExp(`^slug:\\s*${slug.replace(/\./g, '\\.')}\\s*$`, 'm').test(fm.front)) errors.push(`frontmatter needs slug: ${slug}`);
  const parts = splitPage(fm.body);
  const map = new Map();
  for (const [name, body] of parts) {
    if (name && map.has(name)) errors.push(`section "${name}" appears more than once`);
    map.set(name, body);
  }
  if (!map.get('')) errors.push('no introduction before the first `## ` section');
  const required = [...(product === 'platform' ? [REQUIRES[lang]] : []), ...SECTIONS[product][lang]];
  for (const s of required) {
    if (!map.has(s)) errors.push(`missing section "${s}"`);
    else if (!map.get(s)) errors.push(`section "${s}" is empty`);
  }
  return { errors, parts, map, required };
}

let failed = 0;
const failedFiles = new Set();
let checked = 0;
const fail = (file, msg) => {
  console.error(`FAIL ${file}: ${msg}`);
  failedFiles.add(file);
  failed++;
};

// pages: {lang, file, product, version|null, template}
const pages = [];
for (const [lang, root] of [['en', EN_ROOT], ['uk', UK_ROOT]]) {
  for (const file of walk(root, [])) {
    const name = basename(file);
    if (/^index\.mdx?$/.test(name)) continue;
    const product = basename(dirname(file));
    if (!SECTIONS[product]) { fail(file, `unknown product "${product}" (one of: ${Object.keys(SECTIONS).join(', ')})`); continue; }
    if (!/^\d+\.\d+\.mdx?$/.test(name)) { fail(file, 'a release page is named <X.Y>.md'); continue; }
    pages.push({ lang, file, product, version: name.replace(/\.mdx?$/, ''), template: false });
  }
  for (const file of walk(`templates/${lang}`, [])) pages.push({ lang, file, product: 'platform', version: null, template: true });
}

const result = new Map();
for (const p of pages) {
  const slug = p.template ? null : `${p.lang === 'en' ? 'en/' : ''}releases/${p.product}/${p.version}`;
  const r = checkPage(p.file, p.lang, p.product, slug);
  checked++;
  if (Array.isArray(r)) { fail(p.file, r[0]); continue; }
  r.errors.forEach((e) => fail(p.file, e));
  result.set(p.file, r);
}

// Every page exists in both languages, and the translation has the same structure.
const key = (p) => (p.template ? 'template' : `${p.product}/${p.version}`);
const byKey = { en: new Map(), uk: new Map() };
for (const p of pages) byKey[p.lang].set(key(p), p);
for (const lang of ['en', 'uk']) {
  const other = lang === 'en' ? 'uk' : 'en';
  for (const [k, p] of byKey[lang]) {
    if (!byKey[other].has(k)) fail(p.file, `no ${other === 'uk' ? 'Ukrainian' : 'English'} counterpart (${k})`);
  }
}
for (const [k, en] of byKey.en) {
  const uk = byKey.uk.get(k);
  const a = result.get(en.file);
  const b = uk && result.get(uk.file);
  if (!a || !b) continue;
  const names = (r) => r.parts.map(([n]) => n).filter(Boolean);
  // Same number of sections in the same order; the headings of the required ones are checked above in each language.
  if (names(a).length !== names(b).length) fail(uk.file, `has ${names(b).length} sections, the English page has ${names(a).length}`);
  else {
    a.required.forEach((s, i) => {
      const t = b.required[i];
      if (names(a).indexOf(s) !== names(b).indexOf(t)) fail(uk.file, `section "${t}" is not in the place of "${s}" of the English page`);
      // An unchanged repository is unchanged in both languages.
      const ea = a.map.get(s) === NO_CHANGES.en;
      const eb = b.map.get(t) === NO_CHANGES.uk;
      if (ea !== eb) fail(uk.file, `"${t}": ${ea ? `the English page says "${NO_CHANGES.en}", the body must be "${NO_CHANGES.uk}"` : `the body "${NO_CHANGES.uk}" does not match the English page`}`);
    });
  }
}
for (const p of pages) if (!failedFiles.has(p.file)) console.log(`ok   ${p.file}`);

// The brand name never wraps: "Cyber ICE Box" with ordinary spaces is an error in content.
for (const file of walk('src/content/docs', [])) {
  if (/Cyber ICE Box/.test(readFileSync(file, 'utf8'))) fail(file, 'write the brand as Cyber&nbsp;ICE&nbsp;Box (non-breaking spaces)');
}

if (pages.filter((p) => !p.template).length === 0) fail('src/content/docs', 'no release page found');
if (failed) {
  console.error(`${failed} problem(s)`);
  process.exit(1);
}
console.log(`${checked} release page(s) checked`);
