versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)
# integreat-react-native-app

## Conventions

For naming we follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react). 
For the JavasScript code style we use the [standard style](https://standardjs.com/).
For git commit messages [this style](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

## Versioning
![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg) with:
* **`YYYY`** - Full year - 2006, 2016
* **`MM`** - Short month - 1, 2 ... 11, 12
* **`Minor`** - The third number in the version. For feature and bugfix releases.

## Folder structure
```
├── __mocks__
├── modules
│   └── app
│       ├── constants
│       ├── assets
│       ├── components
│       ├── containers
│       ├── actions
│       ├── hocs
│       └── reducers
└── routes
    └── route-name
│       ├── assets
│       ├── components
│       ├── containers
│       │   └── RouteNamePage.js
│       ├── actions
│       ├── hocs
│       └── reducers
```
A component always follows the following structure (Uppercase files always contain a single class):
```
├── __tests__
│   └── Caption.js
└── Caption.js
```

## Technology stack

### Bundler
[Webpack](https://facebook.github.io/metro/) is used to compile and bundle the app.

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

### Debugging
For debugging install [react-native-debugger](https://github.com/jhen0409/react-native-debugger)

#### Enter the development menu
Shake the device or press Ctrl+M to enter the menu. If you are connected though adb to your android device you can also 
run: `adb shell input keyevent 82`

#### Reload the app
You can [enter the development menu](#enter-the-development-menu) and click "Reload" or use adb: `adb shell input text "RR"`

#### Steps to get started with debugging:
* Start react-native-debugger
* Start the metro bundler
* Connect a real device or run an emulator though adb (e.g. `$ANDROID_HOME/emulator/emulator -avd <avd>`)
* Setup network connectivity from the emulator/device to the host where the bundler is running (see [here](#setup-connectivity-from-device-to-metro))
* [Enter the development menu](#enter-the-development-menu) and enable "Remote JS Debugging"
* The app should reload now and the debugger should connect to the device

#### Setup connectivity from device to metro
On Android you have 2 options:
* Setup a tunnel though adb: `adb reverse tcp:8081 tcp:8081`
* Open the development options of the react-native app (shake device or Ctrl+M) and set a development host

On iOS the post 8081 is tunneled by default. You can not change this. If the emulator is running on an other host you 
can proxy the port with `yarn run proxy <host>`

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

### Type checking
[Flow](https://flow.org/) is used for static type checking.

Go to Settings > Languages & Frameworks > JavaScript and
* choose **Flow** as Language version
* set *Flow package or executable* to **<project_dir>/node_modules/flow-bin**

You can run flow using **yarn flow**. 

## IDE
**Make sure you have at least [nodejs 6](https://nodejs.org/) installed**

We suggest IntellJ IDEA Ultimate as IDE. Just import this project (from existing sources).
Run **yarn** in Terminal and right-click on package.json to show the npm scripts. 

Install the following plugins:
* ESLint
* Styled Components
   
If you want you can associate the *.snap files with the file type JavaScript.

# Issue Tracker

You can [view our issues](https://issues.integreat-app.de/projects/NATIVE) or [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.
