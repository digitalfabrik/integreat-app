fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### keystore
```
fastlane keystore
```
Download and decrypt the JKS
### dependencies
```
fastlane dependencies
```
Download Gradle dependencies
### build
```
fastlane build
```
Create an Android build in release mode. Set the environment variable E2E_TEST_IDS if you want a build usable for E2E tests. Set the environment variable TOTAL_CPUS if you run this in a Docker container.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
