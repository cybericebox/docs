import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// The brand name never wraps: non-breaking spaces inside the name.
const BRAND = 'Cyber ICE Box';

export default defineConfig({
  site: 'https://docs.cybericebox.com',
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      title: { uk: `Документація ${BRAND}`, en: `${BRAND} docs` },
      description: `Документація платформи ${BRAND} та лабораторії.`,
      logo: { src: './src/assets/crest.png', alt: BRAND },
      favicon: '/favicon.png',
      // Ukrainian is the main language (root, no prefix); English lives under /en/. The English release pages are the
      // source of the release tool (see README).
      defaultLocale: 'root',
      locales: {
        root: { label: 'Українська', lang: 'uk' },
        en: { label: 'English', lang: 'en' },
      },
      plugins: [starlightLinksValidator()],
      // Generated from the folders: a page marked `draft: true` is absent from the published site and its menu.
      sidebar: [
        { label: 'Лабораторія', translations: { en: 'Laboratory' }, items: [{ autogenerate: { directory: 'laboratory' } }] },
        { label: 'Платформа', translations: { en: 'Platform' }, items: [{ autogenerate: { directory: 'platform' } }] },
        { label: 'Випуски', translations: { en: 'Releases' }, items: [{ autogenerate: { directory: 'releases' } }] },
      ],
    }),
  ],
});
