# Manually Running and Building the App

If you want to run the app locally or create `.ipa` or `.apk` builds for testing purposes you can follow this guide. If
you only want to quickly push an update to the stores then take a look at
the [CI/CD documentation](../../docs/cicd.md#triggering-a-delivery-using-the-ci).

## Contents

- iOS
  - [Setup and prerequisites](#setup-on-ios)
  - [Running the app](#running-the-app-on-ios)
  - [Building the app with a distribution certificate](#building-the-app-with-a-distribution-certificate)
- Android
  - [Setup and prerequisites](#setup-on-android)
  - [Running the app](#running-the-app-on-android)
  - [Running the App via ADB network on mobile device](#running-the-app-via-adb-network)
  - [Building the app using a test signing keystore](#building-the-app-using-a-test-signing-keystore-without-fastlane)
  - [Building the app using for the Play Store](#building-the-app-for-the-play-store)

## iOS

**NOTE: This section just covers the use of the integreat-test-cms build config. More information can be
found [here](build-configs.md).**

### Setup on iOS

#### Prerequisites

- Install and setup XCode.
- [Install and setup Fastlane](../../docs/cicd.md#fastlane-setup).
- Read about [Apple Certificates](apple-certifcates.md).
- To set up the certificates:
  - have access to the `app-credentials` repo
  - have access to the Passbolt folder "Integreat App Publishing"
  - your personal Apple account needs to be added to the Digitalfabrik's account either as an admin or with the right to
    access "Certificates, Identifiers & Profiles".

If you need any of these permissions, ask for them in the ~team-app channel on Mattermost.

#### Certificates Setup

- Install the certificates locally:

```bash
cd ios && fastlane match development
```

If you want to build for for a different environment than development (e.g. production), put that one in the command.

- If you get an error that you can't clone the repo `app-credentials`, request access.

- The password that you need to fill in twice is saved in Passbolt as Digitalfabrik Fastlane Match.

- The Apple account that you need to sign in to is your personal one.

- You will need to add all the `app_identifiers` you want to work with. You can find a list of them at
  https://github.com/digitalfabrik/app-credentials/blob/main/apple%20app%20identifier%20list.txt

##### Trouble Shooting

- [Installing certificates hangs on `Cloning remote git repo...`](troubleshooting.md#bundle-exec-fastlane-certificates-hangs-on-cloning-remote-git-repo)
- Secrets containing `'`: Exporting as environment variable is possible as follows: `export SECRET='<prefix>'"'"'<suffix>'`.

#### Dependency Management

CocoaPods is used for dependency management of the native libraries. It should be usable after setting up Fastlane.

- Make sure CocoaPods is installed by running `bundle exec pod --version`.

- Install the dependencies:
  **This has to be re-run whenever changes to the `package.json` are made!**

```bash
yarn
cd ios && bundle exec pod install
```

_Note: `bundle exec pod install` uses the versions from the `Podfile.lock`.
`bundle exec pod update` updates the `Podfile.lock`._

### Running the App on iOS

- Start the bundler:

```bash
yarn start
```

- Run the app in a simulator or on a real device via XCode:
  - Start XCode and open `ios/Integreat.xcworkspace`.
  - Run the app.

#### Trouble Shooting

- [`Failed to get language code from native side!` in the simulator](troubleshooting.md#failed-to-get-language-code-from-native-side-in-the-simulator)

### Building the App with a Distribution Certificate

- Build the app:

```bash
cd ios && bundle exec fastlane build
```

Fastlane should report where the build artifacts are. These can be uploaded to App Store Connect or distributed via
another way.

## Android

**NOTE: This section just covers the use of the integreat-test-cms build config. More information can be
found [here](build-configs.md).**

### Setup on Android

#### Prerequisites

- Install and setup the Android SDK.
- **Building for the Play Store only:** [Install and setup Fastlane](../../docs/cicd.md#fastlane-setup) (necessary for
  keystore management).

#### Dependency Management

- Install the dependencies:
  **This has to be re-run whenever changes to the `package.json` are made!**

```bash
yarn
```

### Running the App on Android

- Start the bundler and run the app:

```bash
yarn start
yarn android
```

Alternatively, you can also use the GUI in Android Studio to build and run the app, this sometimes helps with
troubleshooting.

### Running the App via ADB network

Start the app on mobile device using **ADB over network**

1. Enable ADB via Network on your phone (Dev Settings)
2. Connect phone via usb
3. Run: `adb tcpip 5555`
4. Plug out phone
5. Run: `adb connect 192.168.x.x`
6. Use the commands in the section above More
   information: [Android 11](https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+) [Android 10 and below](https://developer.android.com/studio/command-line/adb#wireless)

### Building the App using a test signing keystore (without Fastlane)

- [optional] Set the environment variables for the android keystore explicitly:

```bash
export ORG_GRADLE_PROJECT_KEYSTORE_PATH=test.keystore
export ORG_GRADLE_PROJECT_KEYSTORE_PASSWORD=123456
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_ALIAS=test
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_PASSWORD=123456
```

- [optional] Set the version name and code explicitly:

```bash
export ORG_GRADLE_PROJECT_VERSION_CODE=1
export ORG_GRADLE_PROJECT_VERSION_NAME=0.1
```

- Build the app:

```bash
yarn android:release
```

### Building the App for the Play Store

#### Keystore Setup

- Prepare the following environment variables which are necessary to decrypt the keystore:

```bash
export CREDENTIALS_GIT_REPOSITORY_URL=<secret>
export CREDENTIALS_DIRECTORY_PATH=/tmp/credentials
export CREDENTIALS_KEYSTORE_PASSWORD=<secret>
export CREDENTIALS_KEYSTORE_PATH=/tmp/credentials/<secret>.enc
export KEYSTORE_PATH=/tmp/keystore.jks
```

More information about the necessary environment variables can be
found [here](../../docs/cicd.md#environment-variables-and-dependencies).

- Setup the production JKS:

```bash
cd android && bundle exec fastlane keystore
```

- Prepare the following environment variables (necessary to unlock the keystore):

```bash
export KEYSTORE_KEY_ALIAS=<secret>
export KEYSTORE_PASSWORD=<secret>
export KEYSTORE_KEY_PASSWORD=<secret>
```

More information about the necessary environment variables can be
found [here](../../docs/cicd.md#environment-variables-and-dependencies).

#### Build the App

- Build the app:

```bash
cd android && bundle exec fastlane build
```

#### \[Optional\] Install and run the App

- Install the app:

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

- Run the app:

```bash
adb shell am force-stop tuerantuer.app.integreat
adb shell am start -n tuerantuer.app.integreat/.MainActivity
```
