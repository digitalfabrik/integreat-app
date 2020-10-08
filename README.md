[![Dependency Status](https://gemnasium.com/badges/github.com/Integreat/integreat-app.svg)](https://gemnasium.com/github.com/Integreat/integreat-app)
versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)

# integreat-app
## Contents
* [Contributing](#contributing)
* [Getting Started](#getting-started)
* [Bug Reporting](#bug-reporting)
* [Pull Requests](#pull-requests)
* [Further Reading](#further-reading)
* [Glossary](https://wiki.integreat-app.de/glossary)

## Contributing
You can contribute by:
* [Creating Pull requests](../.github/CONTRIBUTING.md#pull-requests)
* [Reporting bugs](#bug-reporting)

**Testing with the live cms instance should be avoided. Instead, [please use the test cms](docs/technology-stack.md#test-cms).**

If you want to know more about Integreat or if you want to join us, contact [Max](mailto:ammann@integreat-app.de),
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).

## Getting Started
### Prerequisites
* Rate our Integreat app in the [PlayStore](https://play.google.com/store/apps/details?id=tuerantuer.app.integreat)
and the [Apple App Store](https://apps.apple.com/ae/app/integreat/id1072353915).
* Install [nodejs](https://nodejs.org/). At least v6 is required, but we recommend the v12 LTS.
Using the latest version (v13) may lead to errors.
* Install [yarn](https://yarnpkg.com/)
* For native development also take a look at the [Android setup](#android) and the [IOS setup](#ios).

#### Android

* Install the Android SDK by using the [Android Support plugin](https://plugins.jetbrains.com/plugin/1792-android-support) in IntelliJ.
* Install the latest stable SDK Platform and Android SDK Tools in the SDK Manager (Settings > Appearance & Behaviour > System Settings > Android SDK)
* \[optional\]: If you want to develop using an emulator, also install the Android Emulator in the Android SDK settings

#### iOS

* Own a Mac or another Apple device.
* Install [XCode](https://developer.apple.com/xcode/).

*Note: In order to work with the XCode project, always open `ios/Integreat.xcworkspace`.*

### Project setup
We suggest **[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)** as IDE. JetBrains provides free licences for students.
If you are using a different IDE, the steps might differ.

* Import this project (VCS > Get from Version Control).
* Run `yarn` in the terminal to install all dependencies.

This is a monorepository. That means it contains more than one project. 
All in all it contains the following projects:

* web:
    * Take a look at web/package.json to show all available npm scripts.
    * Run `yarn start` to start a local webpack dev server.
    * Start coding :)
* native:
    * Take a look at native/package.json to show all available npm scripts.
    * Run `yarn start` to start the bundler.
    
    *Note: For editing native Java code for Android IntelliJ with the Android extension is recommended. For native Swift/Objective-C code [XCode](https://developer.apple.com/xcode/) is required.*
* locales
    

#### Additional Configuration
* Mark the *src* and *www* (web-only) folder as *Source directory*.
* Run > Edit Configurations > Defaults > Jest and set *Configuration file* to *jest.config.json*

* Settings > Languages & Frameworks > JavaScript and
    * Choose *Flow* as Language version
    * Set *Flow package or executable* to *<project_dir>/node_modules/flow-bin*
* [optional] Associate the *\*.snap* files with the file type *JavaScript*.
* [optional] Install the following plugins:
    * [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
    * [EJS](https://plugins.jetbrains.com/plugin/index?xmlId=com.jetbrains.lang.ejs) (for web)
    * [Ruby](https://plugins.jetbrains.com/plugin/1293-ruby) (if working with Fastlane)
* [optional] Configure Linux environment on Windows: [WSL Setup](docs/wsl-setup.md)
### Trouble shooting
* Use nodejs 12 LTS instead of the latest version.
* For any native problems you can take a look at our troubleshooting section [here](native/docs/troubleshooting.md)

## Bug reporting
You can [view our issues](https://issues.integreat-app.de/projects/IGAPP) or
 [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.

## Pull requests
Please take a look at our [conventions](docs/conventions.md).

To merge a pull request,
* at least two approvals are required.
* tests, linting and flow have to succeed.

## Further Reading
More information on both the webapp and the native app specifically can be found in the [web documentation](web/docs) and the [app documentation](native/docs).
Documentation on [ci](docs/cicd.md), [contributing](docs/contributing.md) and our [conventions](docs/conventions.md) can be found [here](docs).
