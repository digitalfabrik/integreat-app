# integreat-react-native-app
## Contents
* [Contributing](#contributing)
* [Getting Started](#getting-started)
* [Conventions](docs/03-conventions.md)
* [Technical Documentation](docs/04-technical-documentation.md)
* [Manual builds](docs/06-manual-builds.md)
* [Continuous Integration and Delivery](docs/08-cicd.md)
* [Glossary](https://wiki.integreat-app.de/glossary)

## Contributing
If you want to know more about Integreat or if you want to join us, contact [Max](mailto:ammann@integreat-app.de),
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).
[Pull requests](#pull-requests) and [bug reports](#bug-reporting) are also very much appreciated.

**Testing and debugging with the live cms instance should be avoided. Instead, [please use the test cms](docs/04-technical-documentation.md#test-cms).**

## Getting Started

We suggest **[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)** as IDE for editing JavaScript code. JetBrains provides free licences for students.
If you are using a different IDE, the steps might differ.

*Note: For the setup of the project on Windows you may want to use Chocolatey and [follow this guide](docs/09-windows-setup.md).*

### Prerequisites
* Install [nodejs](https://nodejs.org/). At least v6 is required, but we recommend the v12 LTS.
Using the latest version (v13) may lead to errors.
* Install [yarn](https://yarnpkg.com/).

#### Android
* Install the Android SDK by using the [Android Support plugin](https://plugins.jetbrains.com/plugin/1792-android-support) in IntelliJ.
* Install the latest stable SDK Platform and Android SDK Tools in the SDK Manager (Settings > Appearance & Behaviour > System Settings > Android SDK)
* \[optional\]: If you want to develop using an emulator, also install the Android Emulator in the Android SDK settings


#### iOS
* Own a Mac or another Apple device.
* Install [XCode](https://developer.apple.com/xcode/).

*Note: In order to work with the XCode project, always open `ios/Integreat.xcworkspace`.*

### Project setup

If using IntelliJ IDEA Ultimate you can import the project easily:

* Import this project (VCS > Get from Version Control).
* Run `yarn` in the terminal to install all dependencies.
* Take a look at package.json to show all available npm scripts.
* Run `yarn start` to start the bundler.

*Note: For editing native Java code for Android IntelliJ with the Android extension is recommended. For native Swift/Objective-C code [XCode](https://developer.apple.com/xcode/) is required.*

#### Running the app

Take a look at the docs for [iOS](docs/06-manual-builds.md#ios) and [Android](docs/06-manual-builds.md#android) to see how to run the app.

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
You can [view our issues](https://issues.integreat-app.de/projects/NATIVE) or
 [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.

## Pull requests
Please take a look at our [conventions](docs/03-conventions.md).

To merge a pull request,
* at least two approvals are required.
* Tests, linting and flow have to succeed.
