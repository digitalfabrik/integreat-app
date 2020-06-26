# Manually Running and Building the App
If you want to run the app locally or create `.ipa` or `.apk` builds for testing purposes you can follow this guide.
If you only want to quickly push an update to the stores then take a look at the [CI/CD documentation](08-cicd.md#triggering-a-build-in-ci).

## Contents
* iOS
    * [Setup and prerequisites](#setup-on-ios)
    * [Running the app](#running-the-app-on-ios)
    * [Building the app with a distribution certificate](#building-the-app-with-a-distribution-certificate)
* Android
    * [Setup and prerequisites](#setup-on-android)
    * [Running the app](#running-the-app-on-android)
    * [Building the app using a test signing keystore](#building-the-app-using-a-test-signing-keystore-without-fastlane)
    * [Building the app using for the Play Store](#building-the-app-for-the-play-store)

## iOS
### Setup on iOS
#### Prerequisites
* Install and setup XCode.
* [Install and setup Fastlane](08-cicd.md#fastlane-setup).
* Read about [Apple Certificates](10-apple-certifcates.md).

#### Certificates Setup
* Prepare the necessary environment variables:
```bash
export FASTLANE_USER=<secret>
export FASTLANE_PASSWORD=<secret>
export MATCH_PASSWORD=<secret>
```

More information about the necessary environment variables can be found [here](08-cicd.md#environment-variables-and-dependencies).

* Install the certificates locally:
```bash
cd ios && bundle exec fastlane certificates
```

##### Trouble Shooting
* `bundle exec fastlane certificates` hangs on `Cloning remote git repo...`:
Copy the last command printed to the console (`git clone ...`) and execute it manually for more information, errors or password prompts.
    * Make sure to have read and write access to the app-credentials repo.
    * Make sure to have git properly set up on the machine (using **ssh** protocol instead of https).
    * The ssh key has to be added permanently in order for the command to work: `cd ~/.ssh/; ssh-add`.
* Secrets containing `'`: Exporting as environment variable is possible as follows: `export SECRET='<prefix>'"'"'<suffix>'`.
* 2FA prompt: Message @Max or @Steffen.

#### Dependency Management
CocoaPods is used for dependency management of the native libraries.
It should be usable after setting up Fastlane.

* Make sure CocoaPods is installed by running `bundle exec pod --version`.

* Install the dependencies:
**This has to be re-run whenever changes to the `package.json` are made!**
```bash
yarn
cd ios && bundle exec pod install
```

*Note: `bundle exec pod install` uses the versions from the `Podfile.lock`.
`bundle exec pod update` updates the `Podfile.lock`.*

### Running the App on iOS
* Start the bundler:
```bash
yarn start
```

* Option 1: Run the app in a simulator:
```bash
yarn start
```

* Option 2: Run the app in a simulator or on a real device via XCode:
    * Start XCode and open `ios/Integreat.xcworkspace`.
    * Run the app.
    
    
#### Trouble Shooting
* `Failed to get "locale" from native side!` in the simulator:
    * Go to `(Device) Settings` > `General` > `Language and Region`.
    * Change `iPhone Language` and `Region`.
    * Reload the app.

### Building the App with a Distribution Certificate
* Build the app:
```bash
cd ios && bundle exec fastlane build
```

Fastlane should report where the build artifacts are. These can be uploaded to App Store Connect or distributed via another way.

## Android
### Setup on Android
#### Prerequisites
* Install and setup the Android SDK.
* **Building for the Play Store only:** [Install and setup Fastlane](08-cicd.md#fastlane-setup) (necessary for keystore management).

#### Dependency Management
* Install the dependencies:
**This has to be re-run whenever changes to the `package.json` are made!**
```bash
yarn
```

### Running the App on Android
* Start the bundler and run the app:
```bash
yarn start
yarn android
```

### Building the App using a test signing keystore (without Fastlane)
* [optional] Set the environment variables for the android keystore explicitly:
```bash
export ORG_GRADLE_PROJECT_KEYSTORE_PATH=test.keystore
export ORG_GRADLE_PROJECT_KEYSTORE_PASSWORD=123456
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_ALIAS=test
export ORG_GRADLE_PROJECT_KEYSTORE_KEY_PASSWORD=123456
```

* [optional] Set the version name and code explicitly:
```bash
export ORG_GRADLE_PROJECT_VERSION_CODE=1
export ORG_GRADLE_PROJECT_VERSION_NAME=0.1
```
* Build the app:
```bash
yarn android:release
```

### Building the App for the Play Store
#### Keystore Setup
* Prepare the following environment variables which are necessary to decrypt the keystore:
```bash
export CREDENTIALS_GIT_REPOSITORY_URL=<secret>
export CREDENTIALS_DIRECTORY_PATH=/tmp/credentials
export CREDENTIALS_KEYSTORE_PASSWORD=<secret>
export CREDENTIALS_KEYSTORE_PATH=/tmp/credentials/<secret>.enc
export KEYSTORE_PATH=/tmp/keystore.jks
```

More information about the necessary environment variables can be found [here](08-cicd.md#environment-variables-and-dependencies).

* Setup the production JKS:
```bash
cd android && bundle exec fastlane keystore
```

* Prepare the following environment variables (necessary to unlock the keystore):
```bash
export KEYSTORE_KEY_ALIAS=<secret>
export KEYSTORE_PASSWORD=<secret>
export KEYSTORE_KEY_PASSWORD=<secret>
```

More information about the necessary environment variables can be found [here](08-cicd.md#environment-variables-and-dependencies).

#### Build the App
* Build the app:
```bash
cd android && bundle exec fastlane build
```

#### [Optional] Install and run the App
* Install the app:
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

* Run the app:
```bash
adb shell am force-stop tuerantuer.app.integreat
adb shell am start -n tuerantuer.app.integreat/.MainActivity
```

