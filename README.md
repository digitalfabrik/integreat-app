versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.M.PATCH-22bfda.svg)
# integreat-react-native-app
## Contents
* [Contributing](#contributing)
* [Getting Started](#getting-started)
* [Conventions](docs/03-conventions.md)
* [Technical Documentation](docs/04-technical-documentation.md)
* [Releasing](docs/06-releasing.md)

## Contributing
If you want to know more about Integreat or if you want to join us, contact [Max](mailto:ammann@integreat-app.de), 
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).
[Pull requests](#pull-requests) and [bug reports](#bug-reporting) are also very much appreciated.

**Testing and debugging with the live cms instance should be avoided. Instead, [please use the test cms](docs/04-technical-documentation.md/#test-cms).**

## Getting Started
### Prerequisites
* Install [nodejs](https://nodejs.org/). At least v6 is required, but we recommend the v12 LTS.
Using the latest version (v13) may lead to errors.
* Install [yarn](https://yarnpkg.com/).

#### Android
* Install the Android SDK by installing [Android Studio](https://developer.android.com/studio/).
* Install the latest stable SDK Platform and Android SDK Tools in the SDK Manager (Android Studio > Tools > SDK Manager)
* [optional]: If you want to develop using an emulator, also install the Android Emulator in the SDK Manager
(Android Studio > Tools > SDK Manager)

#### iOS
* Own a Mac or another Apple device.
* Install [XCode](https://developer.apple.com/xcode/).

### Project setup
We suggest **[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)** as IDE. JetBrains provides free licences for students.
If you are using a different IDE, the steps might differ.

* Import this project (VCS > Get from Version Control).
* Run `git submodule init` and `git submodule update` to initialize the locales submodule.
* Run `yarn` in the terminal to install all dependencies.
* Take a look at package.json to show all available npm scripts.
* Run `yarn start` to start the bundler.

#### Android
* Run your Android Emulator or connect a device.
* Run `yarn android`.

#### iOS
* Install CocoaPods pods: `cd ios && pod install`.
* // TODO certificates
* // TODO run

Note: The command `pod install` uses the versions from the Podfile.lock. `pod update` updates the Podfile.lock.

Note: If you are using Xcode, always open `project.xcworkspace`.

#### Additional Configuration
* Mark the *src* folder as *Source directory*.
* Run > Edit Configurations > Defaults > Jest  
   to set *Configuration file* to *jest.config.json*
   
* Settings > Languages & Frameworks > JavaScript and
    * choose *Flow* as Language version
    * set *Flow package or executable* to *<project_dir>/node_modules/flow-bin*
   
* [optional] Associate the *\*.snap* files with the file type *JavaScript*.
* [optional] Install the following plugins: *Styled Components*.

### Troubleshooting
If you encounter any problems, have a look at our [troubleshooting section](docs/02-troubleshooting.md)

### Debugging
For more information on how to debug, have a look at our [debugging section](docs/01-debugging.md)

## Bug reporting
You can [view our issues](https://issues.integreat-app.de/projects/WEBAPP) or
 [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.

## Pull requests
Please take a look at our [conventions](docs/03-conventions.md).

To merge a pull request, 
* at least two approvals are required.
* Tests, linting and flow have to succeed.
