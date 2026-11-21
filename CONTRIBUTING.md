# Contributing

## Dependency updates

Dependabot opens version updates every Monday morning (Kyiv time), into `develop`. Minor and patch updates are grouped: one pull request per ecosystem and kind per week. Major updates come as separate pull requests, so they stay visible. Config: `.github/dependabot.yml`.

- Nothing merges itself here: every Dependabot pull request waits for the owner.
- Security updates are opened by GitHub against the default branch (`main`), not `develop` (a Dependabot limit). They never merge themselves. Critical and high ones are handled the same day: the fix goes into `develop` first; if production needs it, it ships through the release line as a patch.
- A Dependabot check that fails on a secret means a workflow step uses a repository secret: Dependabot runs get none, so such steps are skipped for it.
