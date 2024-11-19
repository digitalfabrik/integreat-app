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

Other team members you can contact are
[Steffi](mailto:stefanie.metzger@tuerantuer.org) and
[Andy](mailto:andreas.fischer@tuerantuer.org).

## Reporting Issues and Bugs

You can find our issues [here](https://github.com/digitalfabrik/integreat-app/issues) or in one of
our [project views](https://github.com/orgs/digitalfabrik/projects/2/views/1).

If you open a new issue, please make sure to follow the templates and create meaningful issues and bugs.

## Pull Requests

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

### Reviews

We use the following emoji code for reviewing:

- :+1: or `:+1:` This is great! It always feels good when somebody likes your work. Show them!
- :question: or `:question:` I have a question / can you clarify?
- :x: or `:x:` This has to change. It’s possibly an error or strongly violates existing conventions.
- :wrench: or `:wrench:` This is a well-meant suggestion. Take it or leave it.
- :upside_down_face: or `:upside_down_face:` This is a nitpick. Normally related to a small formatting or stylizing detail that shouldn’t block moving forward.
- :thought_balloon: or `:thought_balloon:` I’m just thinking out loud here. Something doesn’t necessarily have to change, but I want to make sure to share my thoughts.
- :clown_face: or `:clown_face:` This is a complaint about something with no obvious answer, not necessarily a problem originating from changes.
