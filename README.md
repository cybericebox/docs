# Cyber&nbsp;ICE&nbsp;Box documentation

Source of the public documentation site, published at <https://docs.cybericebox.com> from GitHub Pages. It is a
[Starlight](https://starlight.astro.build) (Astro) project that builds to static files. The site is in English. Two
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

Pages are Markdown (or MDX) files under `src/content/docs/`; the path is the address. A page needs `title` (and a
`description`) in its frontmatter. To show it in the navigation, add it to `sidebar` in `astro.config.mjs`.

- Do not write text that is not true yet. A page that is not written says so in one sentence.
- Write the brand as `Cyber&nbsp;ICE&nbsp;Box` in Markdown (non-breaking spaces), ` ` in strings of the config or
  frontmatter. `check:releases` also fails on the name written with ordinary spaces.
- A Ukrainian version can be added later: add the `uk` locale to `locales` in `astro.config.mjs` and put the
  translated pages under `src/content/docs/uk/`, same paths as the English ones.

## Release pages

One page per release line of a product: `src/content/docs/releases/<product>/<X.Y>.md`, where `<product>` is
`laboratory`, `platform` or `brain`. Start from `templates/release-page.md`. The page is the single text of the line:
`infrastructure/release/release_line.py` (`make release notes|promote|publish-notes`) cuts the release page of every
repository from it, and `promote` refuses while a section is missing or empty.

| Part | Rule |
|---|---|
| Frontmatter | `title`, and `slug: releases/<product>/<X.Y>` (without it the dot of `X.Y` is dropped from the address, and the link the tool writes would break) |
| Introduction | The text before the first `## ` section |
| `## Requires` | Platform only: what the line needs |
| One `## ` section per repository | Platform: `Backend`, `ID`, `Platform panel`, `Task catalog`, `Event site`, `Landing`. Laboratory: `Laboratory`. Brain: `API`, `Brain`. The names are exact |
| Unchanged repository | The body is exactly `No changes in this repository.` |
| Other `## ` sections | `## Upgrade` and the like belong to no repository and stay on the site only |

A patch release (`X.Y.1`) writes its fixes into the section of the repository that was fixed, in the page of the line.
Use `###` for headings inside a section; a `## ` line inside a code block would still split the page, because the tool
does not know about code blocks.

The tool reads the pages from this directory: `--docs-dir <path to this repo>/src/content/docs` (its default,
`../docs-frontend`, does not point at the pages).

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).
