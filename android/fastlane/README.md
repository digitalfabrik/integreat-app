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
## Android
### android keystore
```
fastlane android keystore
```
Prepare the keystore
### android dependencies
```
fastlane android dependencies
```
Create a release build
### android build
```
fastlane android build
```
Create a release build
### android browserstack_upload_live
```
fastlane android browserstack_upload_live
```
Upload to Browserstack Live
### android browserstack_upload_auto
```
fastlane android browserstack_upload_auto
```
Run e2e tests
### android playstore_upload
```
fastlane android playstore_upload
```
Upload to Play Store

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
