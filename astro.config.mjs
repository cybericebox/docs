import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// The brand name never wraps: non-breaking spaces inside the name.
const BRAND = 'Cyber ICE Box';

export default defineConfig({
  site: 'https://docs.cybericebox.com',
  integrations: [
    starlight({
      title: `${BRAND} docs`,
      description: `Documentation of the ${BRAND} platform and the Laboratory.`,
      logo: { src: './src/assets/crest.png', alt: BRAND },
      favicon: '/favicon.png',
      // English only for now. To add Ukrainian, add `uk: { label: 'Українська', lang: 'uk' }` here and put the
      // translated pages under src/content/docs/uk/ (see README).
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' } },
      plugins: [starlightLinksValidator()],
      sidebar: [
        {
          label: 'Laboratory',
          items: [
            { label: 'Overview', slug: 'laboratory' },
            { label: 'Concepts', slug: 'laboratory/concepts' },
            { label: 'Install', slug: 'laboratory/install' },
            { label: 'Operate', slug: 'laboratory/operate' },
            { label: 'API', slug: 'laboratory/api' },
          ],
        },
        {
          label: 'Platform',
          items: [
            { label: 'Overview', slug: 'platform' },
            { label: 'Install', slug: 'platform/install' },
            { label: 'Events', slug: 'platform/events' },
            { label: 'Tasks', slug: 'platform/tasks' },
            { label: 'Administration', slug: 'platform/administration' },
          ],
        },
        {
          label: 'Releases',
          items: [
            { label: 'Laboratory', collapsed: true, items: [{ autogenerate: { directory: 'releases/laboratory' } }] },
            { label: 'Platform', collapsed: true, items: [{ autogenerate: { directory: 'releases/platform' } }] },
          ],
        },
      ],
    }),
  ],
});
