# integreat-app-native

Android and iOS React Native App for [Integreat](https://integreat-app.de)
, [Malte](https://www.malteser-werke.de/malte-app.html) and [Aschaffenburg](https://aschaffenburg.app).

## Contents

- [Project Setup](#project-setup)
- [Run the App](#running-the-app)
- [Debugging](docs/debugging.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Build Configs](docs/build-configs.md)
- [Persistence](docs/persistence.md)
- [I18n](docs/i18n.md)
- [Error Reporting](docs/error-reporting.md)
- [React Native Upgrades](docs/react-native-upgrades.md)
- [General Repository Documentation](../README.md)

## Project Setup

_Make sure to have read and followed the steps in the [general README](../README.md#project-setup)._

- Run `yarn` in the terminal to install all dependencies.
- Take a look at the [available scripts](package.json). The most important scripts are also available as IntelliJ Run
  Configurations.

Depending on whether you want to develop for Android, iOS or both the following extra steps are necessary:

### Android

- Install Java JDK, SDK and Runtime (v8 or v11).
- Install the Android SDK by using
  the [Android Support plugin](https://plugins.jetbrains.com/plugin/1792-android-support) in IntelliJ.
- Install the latest stable SDK Platform and Android SDK Tools in the SDK Manager (Settings > Appearance & Behaviour >
  System Settings > Android SDK).
- Install and accept the SDK license in the SDK Manager.
- [optional] If you want to develop using an emulator, also install the Android Emulator in the Android SDK settings.

### iOS

- Own a Mac or another Apple device.
- Install [XCode](https://developer.apple.com/xcode/).

_Note: In order to work with the project in XCode, always open `ios/Integreat.xcworkspace`._

### Additional Configuration

- Run > Edit Configurations > Defaults > Jest:
  - Set _Configuration file_ to _jest.config.json_
- [optional] Install the following plugins:
  - [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
  - [Ruby](https://plugins.jetbrains.com/plugin/1293-ruby) (if working with Fastlane)

## Running the app

Take a look at the docs for [iOS](docs/manual-builds.md#ios) and [Android](docs/manual-builds.md#android) to see how to
run the app.

## CMS

**Testing with the production cms should be avoided!**

In development builds, i.e. `yarn start`, the test cms is used as default.

To switch between production and test cms, press the yellow location marker on the landing page 10 times.
On iOS it may be required to close and reopen the app after changing the cms instance.

The cms repository can be found [here](https://github.com/digitalfabrik/integreat-cms).
There is no up-to-date api documentation but an outdated one can be found [here](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation).

### Testing CMS Content

To test with content from the cms the **testumgebung** can be used. If you don't know how to do that, reach out to us.

### Hidden Cities

Hidden cities, especially the testumgebung, can be shown by entering the search query `wirschaffendas` in the city selection.
