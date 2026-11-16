# Cyber&nbsp;ICE&nbsp;Box documentation

Source of the public documentation site, published at <https://docs.cybericebox.com> from GitHub Pages. It is a
[Starlight](https://starlight.astro.build) (Astro) project that builds to static files. The site is in two languages: Ukrainian (the main one, at the root) and English (under `/en/`). Two
independent products have their own sections: the **Laboratory** and the **platform**, plus the release notes of each.

## Run locally

Node 26 (see `.nvmrc`).

```sh
npm ci
npm run dev              # http://localhost:4321
npm run build            # static site in dist/; also checks every internal link
npm run check:releases   # release pages have every required section, and none is empty
```

Dependencies are pinned to exact versions; update them on purpose, with the lockfile.

## Branches

- `develop`: pages for the coming version collect here. Open pull requests into `develop`.
- `main`: what is published. A push to `main` builds and deploys the site (`.github/workflows/pages.yml`), so `main`
  changes only when a product is promoted: `develop` is merged into it at that moment.

Pull requests run `.github/workflows/check.yml` (install, build, `check:releases`). Every action in the workflows is
pinned by full commit SHA, with the version in a comment.

## Adding a page

Pages are Markdown (or MDX) files. Every page exists in both languages, with the same path:

| Language | Folder | Address |
|---|---|---|
| Ukrainian (default) | `src/content/docs/` | `/laboratory/concepts/` |
| English | `src/content/docs/en/` | `/en/laboratory/concepts/` |

A page needs `title` and `description` in its frontmatter. To show it in the navigation, add it to `sidebar` in
`astro.config.mjs` (a slug without the language, a Ukrainian `label`, and `translations: { en: '...' }`). The language
picker is in the header. Links inside a page start with the language folder of that page (`/en/...` in English pages).

- Do not write text that is not true yet. A page that is not written says so in one sentence.
- Ukrainian terms: event = «захід», task = «завдання», variant = «варіант», laboratory = «лабораторія», device = «пристрій»,
  cookies = «файли cookie».
- Write the brand as `Cyber&nbsp;ICE&nbsp;Box` in Markdown (non-breaking spaces), `\u00A0` in strings of the config or
  frontmatter. `check:releases` also fails on the name written with ordinary spaces.

## Release pages

One page per release line of a product, in each language:

- English: `src/content/docs/en/releases/<product>/<X.Y>.md`. **This is the source for the release tool.**
- Ukrainian: `src/content/docs/releases/<product>/<X.Y>.md`, a translation with translated headings.

`<product>` is `laboratory`, `platform` or `brain`. Start from `templates/en/release-page.md` and
`templates/uk/release-page.md`. `infrastructure/release/release_line.py` (`make release notes|promote|publish-notes`)
cuts the GitHub release page of every repository from the English page (those pages are English), and `promote`
refuses while a section is missing or empty. The Ukrainian page stays on the site only.

| Part | Rule |
|---|---|
| Frontmatter | `title`, and `slug`: `en/releases/<product>/<X.Y>` (English) or `releases/<product>/<X.Y>` (Ukrainian). Without it the dot of `X.Y` is dropped from the address, and the link the tool writes would break |
| Introduction | The text before the first `## ` section |
| Requires | Platform only: `## Requires` (Ukrainian: `## Вимоги`) |
| One `## ` section per repository | Platform: `Backend`, `ID`, `Platform panel`, `Task catalog`, `Event site`, `Landing` (Ukrainian: `Бекенд`, `ID`, `Панель платформи`, `Каталог завдань`, `Сайт заходу`, `Лендінг`). Laboratory: `Laboratory` (`Лабораторія`). Brain: `API`, `Brain`. The English names are exact: the tool matches them |
| Unchanged repository | The body is exactly `No changes in this repository.` (Ukrainian: `Без змін у цьому репозиторії.`) |
| Other `## ` sections | `## Upgrade` (`## Оновлення`) and the like belong to no repository and stay on the site only |

`npm run check:releases` checks the English pages against the sections the tool needs, checks the Ukrainian pages
against the translated headings, requires every page in both languages, the same sections in the same order, and the
same repositories marked unchanged.

A patch release (`X.Y.1`) writes its fixes into the section of the repository that was fixed, in the page of the line.
Use `###` for headings inside a section; a `## ` line inside a code block would still split the page, because the tool
does not know about code blocks.

The tool reads the pages from the English folder and builds the link to the full notes from `--docs-url`:

```sh
python3 infrastructure/release/release_line.py notes --product platform --version 2.0 \
  --docs-dir <path to this repo>/src/content/docs/en --docs-url https://docs.cybericebox.com/en
```

Its defaults (`../docs-frontend` and `https://docs.cybericebox.com`) point at neither; the English pages live under `/en/`.

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).
