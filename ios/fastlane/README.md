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
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios certificates
```
fastlane ios certificates
```
Setup certificates
### ios build
```
fastlane ios build
```
Create a simulator build
### ios release
```
fastlane ios release
```
Create a release build
### ios testflight_upload
```
fastlane ios testflight_upload
```
Upload to TestFlight
### ios browserstack_upload_live
```
fastlane ios browserstack_upload_live
```
Upload to Browserstack Live
### ios browserstack_e2e_tests
```
fastlane ios browserstack_e2e_tests
```
Run E2E tests on BrowserStack

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
