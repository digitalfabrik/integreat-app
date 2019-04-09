versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)
# integreat-react-native-app

## Development

### Setup

* Clone the repository
* Install Android Studio and try to setup a test project
* If you plan to use an Emulator try to run it with the test project and make sure it works
* Open the project with an IDE of your choice
* Run `yarn`

### Running the App for development

* Run `yarn start` to start the bundler

#### Android

* Run your Android Emulator or connect a device
* Run `yarn android`

#### iOS
* Install CocoaPods pods: `cd ios && pod install`
* Run `yarn ios`

Note: The command `pod install` uses the versions from the Podfile.lock. `pod update` updates the Podfile.lock 

Note: All dependencies are handled by CocoaPods. The versions in node_modules/ should not be used!

Note: If you are using Xcode, always open `project.xcworkspace`

### IDE setup
**Make sure you have at least [nodejs 6](https://nodejs.org/) installed**

We suggest IntellJ IDEA Ultimate as IDE. Just import this project (from existing sources).
Run **yarn** in Terminal and right-click on package.json to show the npm scripts. 

Install the following plugins:
* ESLint
* Styled Components
   
If you want you can associate the *.snap files with the file type JavaScript.

### Installing libraries with native code

If you want to install an external library which brings native Android/iOS code you have to check several things:
* Edit `Podfile` and `build.gradle` to include the native parts. DO NOT RUN `yarn react-native link`!
* Run `pod update` in the `ios/` folder
* Make sure the App still compiles on Android and iOS

# Debugging:
[Debugging](./docs/debugging.md)

# Conventions:
[Conventions](./docs/conventions.md)

# If you encounter problems:
[Common Problems](./docs/common-problems.md)

## Technology stack

### Bundler
[Metro](https://facebook.github.io/metro/) is used to compile and bundle the app.

### Frontend framework
[React](https://facebook.github.io/react/) is used as frontend framework.
This allows us to build a single-page-application easily.

### JavaScript compiler
[Babel](https://babeljs.io/) is used to make the app available to a broader audience while 
allowing the developers to use many new language features. We use flow for type safety.

### Application state
[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

### Testing
* [Jest](https://facebook.github.io/jest/) is used for testing.
* [<img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/header/header-logo.svg" width="150">](https://www.browserstack.com) is used for testing cross-platform compatibility
* The [React Native Testing Library](https://github.com/callstack/react-native-testing-library) is used to test React Native Components

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

### Type checking
[Flow](https://flow.org/) is used for static type checking.

Go to Settings > Languages & Frameworks > JavaScript and
* choose **Flow** as Language version
* set *Flow package or executable* to **<project_dir>/node_modules/flow-bin**

You can run flow using **yarn flow**. 

# Issue Tracker

You can [view our issues](https://issues.integreat-app.de/projects/NATIVE) or [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.
