# Manual builds

If you want to create `.ipa` or `.apk` builds for testing purposes you can follow this guide. If you only want to quickly push an update to the stores then take a look [at the CI/CD documentation](08-cicd.md#triggering-a-build-in-ci).

## Manually building for iOS

Firstly you have to prepare a few environment variables:

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

*Hint: After setting up the certificates you can also star to use XCode to build the app.*

Build the app:

```bash
cd ios/
bundle exec fastlane build
```

Fastlane should report where the build artifacts are. These can be uploaded to App Store Connect.

### Run the app in a simulator

If you want to quickly run the app in an emulator do the following:

```bash
yarn start
yarn ios
```

## Manually building for Android

If you do not have Fastlane installed [skip to the next section](#quick-builds-using-a-test-signing-key).
Firstly you have to prepare a few environment variables:

```bash
export CREDENTIALS_GIT_REPOSITORY_URL=<secret>
export CREDENTIALS_DIRECTORY_PATH=/tmp/credentials
export CREDENTIALS_KEYSTORE_PASSWORD=<secret>
export CREDENTIALS_KEYSTORE_PATH=/tmp/credentials/<secret>.enc
export KEYSTORE_PATH=/tmp/keystore.jks
```

Setup your JKS now:

```bash
bundle exec fastlane keystore
```

Finally, provide some more information about unlocking the JKS:

```bash
export KEYSTORE_KEY_ALIAS=<secret>
export KEYSTORE_PASSWORD=<secret>
export KEYSTORE_KEY_PASSWORD=<secret>
```

The last step is to build to app:

```bash
bundle exec fastlane build
```

Install and run the app using:

```bash
adb install app/build/outputs/apk/release/app-release.apk
adb shell am force-stop tuerantuer.app.integreat
adb shell am start -n tuerantuer.app.integreat/.MainActivity
```

### Quick builds using a test signing key

If you don't want to deal with the production signing key you can use the test singing JKS. First explicitly set the environment variables:

```bash
export ORG_GRADLE_PROJECT_KEYSTORE_PATH=test.keystore
export ORG_GRADLE_PROJECT_KEYSTORE_PASSWORD=123456
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_ALIAS=test
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_PASSWORD=123456
```

Optionally you can also set the version name and code:
```bash
export ORG_GRADLE_PROJECT_VERSION_CODE=1
export ORG_GRADLE_PROJECT_VERSION_NAME=0.1
```

Then you can create a quick rest build in release mode and run it on your emulator:

```bash
yarn android:release
```

### Run the app in an emulator

If you want to quickly run the app in an emulator do the following:

```bash
yarn start
yarn android
```
