# End-to-End Tests

The E2E-tests can be found in the [e2e-tests subdirectory](../e2e-tests).
To run the E2e-tests take a look at the commands in the [package.json](../e2e-tests/package.json).

## Running the tests

### Local

To run the web E2E-tests you just have run 
```
yarn workspace e2e test:web
``` 
This will launch the webapp and an automated chrome session where you can follow the test execution. If your don't have chrome installed you can adjust the `browserName` (firefox, edge, safari) in the `wdio.conf.ts` in the E2E-test web subdirectory.

For you first have to build and install the app with the E2E build configuration:
```
yarn workspace e2e prepare:android
```
Then start the packager:
```
yarn workspace e2e prepare:start
``` 
It is recommended to start the app once manually to avoid timeouts during local testing. After you have the app installed and running you can execute the native E2E-test with 
```
yarn workspace e2e test:native
``` 

## WebdriverIO

[WebdriverIO](https://webdriver.io/) is the framework surrounding the E2E-tests. It provides services to instantiate a local selenium server, connect to browserstack and to select the correct chromedriver. Additionally, it can be configured to run multiple E2E-tests in parallel.

> **Note**
> WebdriverIO provides selectors for react components. However, they do not work properly for internet explorer in web. Therefore, you should use more primitive selectors instead (like xpath).

## Browserstack

Browserstack provides you with a large set of available operating systems, browser, and browser versions.
To see and run the E2E tests on Browserstack you need a Browserstack account, with access to our organization.
You will need to set `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER` as environment variables, which you can find when logging in to Browserstack and selecting either the Automate or AppAutomate tab.
If you don't have this access you can still execute the tests locally with `yarn e2e:web` or `yarn e2e:native`.
For the browserstack tests in web there are several configurations to run the tests in the specified browsers. Preferably you should run these from the commandline, e.g. `yarn wdio run web/browserstack/wdio-browserstack-safari.conf.ts` from the project root. There is also a configuration in the `package.json`, which runs all of the browserstack configurations sequentially.

## Writing Tests

The E2E-tests project does not use flow, but implements everything using [TypeScript](https://www.typescriptlang.org/).
The [E2E test folder](../e2e-tests/web/test) contains two important subdirectories:

- [PageObjects](../e2e-tests/web/test/pageobjects)
- [End-to-End Tests](../e2e-tests/web/test/specs)

When writing new tests create helper classes for each Page you are using in the tests to keep the tests uniform and readable. This is also called the [page object pattern](https://webdriver.io/docs/pageobjects/).
The tests itself are then created in the test folder and have to end on `*.e2e.ts`.

### Native

#### Selectors

Selectors are used to select an element in the app programmatically.
However, during native development most of the common selectors are not available. 
Therefore, you should use the accessibility identifier for this.
Add the accessibility-id to a React component using `testID('Example-Component')`. You can query this component with `$('~Example-Component')` in your test.

For more complex queries you should add/use a custom [Selector]('../e2e/native/Selector.ts) using [predicate strings](https://github.com/facebookarchive/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules) for iOS and [UiSelectors](https://developer.android.com/reference/androidx/test/uiautomator/UiSelector) for Android.

## Troubleshooting

### Cannot hide Keyboard on iOS

https://stackoverflow.com/a/54995267
>The Appium method hideKeyboard() is known to be unstable when used on iPhone devices, as listed in Appium’s currently known open issues. Using this method for an iOS device may cause the Appium script to hang. Appium identifies that the problem is because "There is no automation hook for hiding the keyboard. Rather than using this method just think about how a user would hide the keyboard in your app, and tell Appium to do that instead.
