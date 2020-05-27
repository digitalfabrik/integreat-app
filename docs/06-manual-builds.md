# Manual builds

If you want to run the app locally or create `.ipa` or `.apk` builds for testing purposes you can follow this guide. If you only want to quickly push an update to the stores then take a look [at the CI/CD documentation](08-cicd.md#triggering-a-build-in-ci).

## Manually building for iOS

First setup XCode and [CocoaPods](#setup-of-cocoapods).
Now you have to prepare a [few environment variables](08-cicd.md#environment-variables-and-dependencies):

```bash
export FASTLANE_USER=<secret>
export FASTLANE_PASSWORD=<secret>
export MATCH_PASSWORD=<secret>
```

Setup the certificates locally:

```bash
cd ios/
bundle exec fastlane certificates
```

*Note: After setting up the certificates you can also start to use XCode to build the app.*

Build the app:

```bash
yarn
cd ios/
bundle exec pod install
bundle exec fastlane build
```

Fastlane should report where the build artifacts are. These can be uploaded to App Store Connect.

### Run the app in a simulator

First setup XCode and [CocoaPods](#setup-of-cocoapods).
If you want to quickly run the app in an emulator do the following:

```bash
yarn
cd ios/
bundle exec pod install
cd ..
yarn start
yarn ios
```

### Setup of CocoaPods

CocoaPods is used for dependency management of the native libraries.
First you have to make sure that Ruby is working correctly. We advise to use RVM as mentioned in the [setup of Fastlane](08-cicd.md#setup-of-fastlane). After running this setup you should also be able to do `bundle exec pod --version`.

*Note: `bundle exec pod install` uses the versions from the `Podfile.lock`. `bundle exec pod update` updates the `Podfile.lock`.*

## Manually building for Android

If you do not have Fastlane installed [skip to the next section](#quick-builds-using-a-test-signing-key).
Firstly you have to prepare a [few environment variables](08-cicd.md#environment-variables-and-dependencies):

```bash
export CREDENTIALS_GIT_REPOSITORY_URL=<secret>
export CREDENTIALS_DIRECTORY_PATH=/tmp/credentials
export CREDENTIALS_KEYSTORE_PASSWORD=<secret>
export CREDENTIALS_KEYSTORE_PATH=/tmp/credentials/<secret>.enc
export KEYSTORE_PATH=/tmp/keystore.jks
```

Setup your JKS now:

```bash
cd android/
bundle exec fastlane keystore
```

Finally, provide some more information about unlocking the JKS:

```bash
export KEYSTORE_KEY_ALIAS=<secret>
export KEYSTORE_PASSWORD=<secret>
export KEYSTORE_KEY_PASSWORD=<secret>
```

The last step is to build the app:

```bash
yarn
cd android/
bundle exec fastlane build
```

Install and run the app using:

```bash
adb install app/build/outputs/apk/release/app-release.apk
adb shell am force-stop tuerantuer.app.integreat
adb shell am start -n tuerantuer.app.integreat/.MainActivity
```

### Quick builds using a test signing key

If you don't want to deal with the production signing key you can use the test singing JKS.

Optionally, you can explicitly set the environment variables:

```bash
export ORG_GRADLE_PROJECT_KEYSTORE_PATH=test.keystore
export ORG_GRADLE_PROJECT_KEYSTORE_PASSWORD=123456
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_ALIAS=test
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_PASSWORD=123456
```

Optionally, you can also set the version name and code:

```bash
export ORG_GRADLE_PROJECT_VERSION_CODE=1
export ORG_GRADLE_PROJECT_VERSION_NAME=0.1
```

Then you can create a quick test build in release mode and run it on your emulator:

```bash
yarn
yarn android:release
```

### Run the app in an emulator

If you want to quickly run the app in an emulator do the following:

```bash
yarn
yarn start
yarn android
```
