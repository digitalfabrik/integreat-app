# Contributing

Contributing to Integreat is always appreciated! Just start by [opening a pull request](#pull-requests), [reporting a bug](#bug-reporting)
or [contact us](#contact-us) if you don't know where to start.

## Contact us

If you don't know where to start or if you want to know more about Integreat, contact [Max](mailto:ammann@integreat-app.de), 
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).

Other team members you can contact are 
[Lutz](mailto:lonnemann@integreat-app.de),
[Sarah](mailto:sporck@integreat-app.de),
[Michi](mailto:markl@integreat-app.de),
[Simon](mailto:vortkamp@integreat-app.de),
[Nick](mailto:klug@integreat-app.de),
[Anja](mailto:stricker@integreat-app.de) and
[Sven](mailto:seeberg@integreat-app.de).

## Pull requests

Before starting to write code and opening a pull request, please take a look [at our conventions](docs/conventions.md).

Pull requests should always belong to an [issue in our issue tracker](#bug-reporting).

To merge a pull request, the following is necessary:
* All checks (linting, flow, unit and e2e tests) have to pass.
* No changes are requested.
* Two approvals are needed.

**Creating a pull request from a fork prevents checks from the CI. It is a good way to make contact though.**

### Release notes

Pull requests with changes that are visible to our end users should always include one (or more) release note describing the changes.
For other changes, these release notes are optional, but make sure to set the flag `show_in_stores` to false.

To add a release note:
* Have a look at the [template](release-notes/ReleaseNoteTemplate.yml).
* Add a new release note to the [unreleased directory](release-notes/unreleased).

This gives users, members of other teams and us developers a simple overview over which changes and features belong to which release.
The release notes can be found [here](release-notes) and [here](release-notes) and are automatically moved to a new release directory during a release.
They are also shown in the stores and the [release section of github](https://github.com/Integreat/integreat-react-native-app/releases).

## Bug reporting

You can [view our issues](https://issues.integreat-app.de/projects/NATIVE) or
[create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.
