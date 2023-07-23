fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### keystore

```sh
[bundle exec] fastlane keystore
```

Download and decrypt the JKS

### dependencies

```sh
[bundle exec] fastlane dependencies
```

Download Gradle dependencies

### build

```sh
[bundle exec] fastlane build
```

Create an Android build in release mode. Set the environment variable E2E_TEST_IDS if you want a build usable for E2E tests. Set the environment variable TOTAL_CPUS if you run this in a Docker container.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
