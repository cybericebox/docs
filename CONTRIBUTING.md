# Contributing

## Dependency updates

Dependabot opens version updates every Monday morning (Kyiv time), into the default branch (`develop`). Minor and patch updates are grouped: one pull request per ecosystem and kind per week. Major updates come as separate pull requests, so they stay visible. Config: `.github/dependabot.yml`.

- Nothing merges itself here: every Dependabot pull request waits for the owner.
- Security fixes come as one grouped pull request per ecosystem (the `*-security` group), not one per package. Critical and high ones are handled the same day. It waits for the owner. If production needs the fix, it ships through the release line as a patch.
- A Dependabot check that fails on a secret means a workflow step uses a repository secret: Dependabot runs get none, so such steps are skipped for it.
