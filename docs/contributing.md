# Contributing

Contributing to Integreat is always appreciated! You can start
by [reporting a bug](#reporting-issues-and-bugs), [opening a pull request](#pull-requests),
or [contacting us](#contact-us) if you don't know where to start. Please make sure to have a look at
our [conventions](conventions.md).

## Contact us

If you don't know where to start or if you want to know more about Integreat,
contact [Leandra](mailto:leandra.hahn@tuerantuer.org),
[Steffen](mailto:steffen.kleinle@tuerantuer.org) or [our info mail](mailto:info@integreat-app.de) and visit
our [website](https://integreat-app.de).

Other team members you can contact are
[Sarah](mailto:sarah.sporck@tuerantuer.org),
[Steffi](mailto:stefanie.metzger@tuerantuer.org) and
[Andy](mailto:andreas.fischer@tuerantuer.org).

## Reporting Issues and Bugs

You can find our issues [here](https://github.com/digitalfabrik/integreat-app/issues) or in one of
our [project views](https://github.com/orgs/digitalfabrik/projects/2/views/1).

If you open a new issue, please make sure to follow the templates and create meaningful issues and bugs.

## Pull requests

Before starting to write code and opening a pull request, please take a look [at our conventions](conventions.md).

Pull requests should belong to one of our [issues](https://github.com/digitalfabrik/integreat-app/issues).
If you are looking for issues to work on, a good place to start are
our [Good first issues](https://github.com/orgs/digitalfabrik/projects/2/views/5).

To merge a pull request, it has to match our Definition of Done. It includes among others:

- All checks (linting, unit and e2e tests, ...) have to pass.
- No changes are requested.
- Two approvals are needed.
- A [release note](#release-notes) was added.
- New and changed functionality should be tested sufficiently, both manual and by writing unit tests.

**Not all checks are executed for PRs in forked repositories.**

### Release notes

Pull requests with changes that are visible to our end users should always include one (or more) release note describing
the changes.
For other changes, these release notes are optional, but make sure to set the flag `show_in_stores` to false.

To add a release note:

- Have a look at the [template](../release-notes/ReleaseNoteTemplate.yml).
- Add a new release note to the [unreleased directory](../release-notes/unreleased).

This gives users, members of other teams and us developers a simple overview over which changes and features belong to
which release.
The release notes can be found [here](../release-notes) and are automatically moved to a new release directory during a
release.
They are also shown in the stores and
the [release section of github](https://github.com/digitalfabrik/integreat-app/releases).
