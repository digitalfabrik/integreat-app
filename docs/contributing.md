# Contributing

Contributing to Integreat is always appreciated! You can start
by [reporting a bug](#reporting-issues-and-bugs), [opening a pull request](#pull-requests),
or [contacting us](#contact-us) if you don't know where to start. Please make sure to have a look at
our [conventions](conventions.md).

Before contributing, please make sure to have a look at our [conventions](conventions.md).

## Contents

- [Contact](#contact-us)
- [Reporting Issues and Bugs](#reporting-issues-and-bugs)
- [Pull Requests](#pull-requests)
- [Release Notes](#release-notes)
- [Reviews](#reviews)

## Contact Us

If you don't know where to start or if you want to know more about Integreat,
contact [Leandra](mailto:leandra.hahn@tuerantuer.org),
[Steffen](mailto:steffen.kleinle@tuerantuer.org) or [our info mail](mailto:info@integreat-app.de) and visit
our [website](https://integreat-app.de).

## Reporting Issues and Bugs

You can find our issues [here](https://github.com/digitalfabrik/integreat-app/issues) or in one of
our [project views](https://github.com/orgs/digitalfabrik/projects/2/views/1).

If you open a new issue, please make sure to follow the templates and create meaningful issues and bugs.

## Pull Requests

Before starting to write code and opening a pull request, please take a look [at our conventions](conventions.md).

Pull requests should belong to one of our [issues](https://github.com/digitalfabrik/integreat-app/issues).
If you are looking for issues to work on, a good place to start are
our [good first issues](https://github.com/orgs/digitalfabrik/projects/2/views/5).

PR labels:
We use auto-generated release notes and format them based on PR labels.

- Add `native`/`web` labels for native/web **only** PRs (do not add labels to PRs affecting both native and web)
- Add `maintenance` for PRs without user-facing changes

To merge a pull request, it has to match our Definition of Done. It includes among others:

- All checks (formatting, linting and unit tests) have to pass.
- No changes are requested.
- Two approvals are needed.
- New and changed functionality should be tested sufficiently, both manual and by writing unit tests.
- If applicable: A [release note](#release-notes) was added.

_Note: All user facing texts must be translated.
To do so, add them to the correct namespace in [translations.json](../translations/translations.json).
Only add German and English translations, other languages must be collected and be [translated by professional translators](../translations/README.md#export-and-import-workflow).
If you speak another language natively, feel free to add those translations as well.
DO NOT use Google Translate or similar services to translate other languages._

### Release notes

We write manual user-facing release notes for our PRs.
Our release notes can be found [here](../release-notes) and are automatically moved to the corresponding release directory.
They are also shown in the stores and the [release section of github](https://github.com/digitalfabrik/integreat-app/releases).

### When to Write Release Notes

Currently, release notes are only used for `android` and `ios`. Release notes for `web` are therefore NOT necessary!
Our PRs can be divided into three categories:

- PRs with user-facing changes: Write one (or more) release note. Exceptions:
  - The feature is not yet on production, as the problem only appears on main/beta OR the feature is hidden by e.g. a feature flag
  - The changes are really minor, e.g. typos
- PRs relevant to other teams: Write one (or more) release note.
- Other PRs: Do NOT write a release note.

### How to Write Release Notes

Release notes should be short, concise and understandable to our end users and other teams and therefore not require technical knowledge.
Avoid complicated grammar and words as well as technical or internal terms.
A German translation is only necessary (and used) if [show in stores](#show-in-stores) is set to true.

To add a release note:

- Have a look at the [template](../release-notes/ReleaseNoteTemplate.yml).
- Add a new release note to the [unreleased directory](../release-notes/unreleased).

**WARNING: `native` is not a valid platform, use `android` and `ios` instead!**

#### Show in Stores

Every release note includes a boolean flag `show_in_stores`.
This flag only has an effect for release notes with platform `android` and/or `ios` set.
Accordingly, `show_in_stores` should only be set to `true` if

- the release note describes a change that is **visible to our end users** (see [When to Write Release Notes](#when-to-write-release-notes)) AND
- the change is for `android` and/or `ios`

In all other cases, `show_in_stores` should be set to `false.

### Reviews

We use this [emoji code](./conventions.md#reviews) for reviewing.
