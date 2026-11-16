import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// The brand name never wraps: non-breaking spaces inside the name.
const BRAND = 'Cyber ICE Box';

export default defineConfig({
  site: 'https://docs.cybericebox.com',
  integrations: [
    starlight({
      title: { uk: `Документація ${BRAND}`, en: `${BRAND} docs` },
      description: `Documentation of the ${BRAND} platform and the Laboratory.`,
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
      sidebar: [
        {
          label: 'Лабораторія',
          translations: { en: 'Laboratory' },
          items: [
            { label: 'Огляд', translations: { en: 'Overview' }, slug: 'laboratory' },
            { label: 'Концепції', translations: { en: 'Concepts' }, slug: 'laboratory/concepts' },
            { label: 'Встановлення', translations: { en: 'Install' }, slug: 'laboratory/install' },
            { label: 'Експлуатація', translations: { en: 'Operate' }, slug: 'laboratory/operate' },
            { label: 'API', slug: 'laboratory/api' },
          ],
        },
        {
          label: 'Платформа',
          translations: { en: 'Platform' },
          items: [
            { label: 'Огляд', translations: { en: 'Overview' }, slug: 'platform' },
            { label: 'Встановлення', translations: { en: 'Install' }, slug: 'platform/install' },
            { label: 'Заходи', translations: { en: 'Events' }, slug: 'platform/events' },
            { label: 'Завдання', translations: { en: 'Tasks' }, slug: 'platform/tasks' },
            { label: 'Адміністрування', translations: { en: 'Administration' }, slug: 'platform/administration' },
          ],
        },
        {
          label: 'Випуски',
          translations: { en: 'Releases' },
          items: [
            { label: 'Лабораторія', translations: { en: 'Laboratory' }, collapsed: true, items: [{ autogenerate: { directory: 'releases/laboratory' } }] },
            { label: 'Платформа', translations: { en: 'Platform' }, collapsed: true, items: [{ autogenerate: { directory: 'releases/platform' } }] },
          ],
        },
      ],
    }),
  ],
});
