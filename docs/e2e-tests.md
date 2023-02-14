# End-to-End Tests

The E2E-tests can be found in the [e2e-tests subdirectory](../e2e-tests).
To run the E2e-tests take a look at the commands in the [package.json](../e2e-tests/package.json).

## WebdriverIO

[WebdriverIO](https://webdriver.io/) is the framework surrounding the E2E-tests. It provides services to instantiate a
local selenium server, connect to browserstack and to select the correct chromedriver. Additionally, it can be
configured to run multiple E2E-tests in parallel.

> **Note**
> WebdriverIO provides selectors for react components. However, they do not work properly for internet explorer in web.
> Therefore, you should use more primitive selectors instead (like xpath).

## Browserstack

Browserstack provides you with a large set of available operating systems, browser, and browser versions.
To see and run the E2E tests on Browserstack you need a Browserstack account, with access to our organization.
You will need to set `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER` as environment variables, which you can find
when logging in to Browserstack and selecting either the Automate or AppAutomate tab.
If you don't have this access you can still execute the tests locally with `yarn test:web` or `yarn test:native`.
For native browserstack tests you also have to set the environment variable `E2E_CONFIG` to either `android` or `ios`.
You also have to set the `E2E_BROWSERSTACK_APP` variable, which corresponds to the id of a `*.apk` or `*.ipa`, which is
already uploaded to browserstack.
To get such id, you either upload an `*.apk` or `*.ipa` to browserstack or use an already existing one (Checkout other
jobs. Using the same `*.apk` will not influence the other test). The id looks something like
this: `bs://8ad23ac842b0ed12dafff0461bc3a0b98484234f`.

## Writing Tests

The E2E-tests project implements everything using [TypeScript](https://www.typescriptlang.org/).
The [E2E test folder](../e2e-tests/web/test) contains two important subdirectories:

- [PageObjects](../e2e-tests/web/test/pageobjects)
- [End-to-End Tests](../e2e-tests/web/test/specs)

When writing new tests create helper classes for each Page you are using in the tests to keep the tests uniform and
readable. This is also called the [page object pattern](https://webdriver.io/docs/pageobjects/).
The tests itself are then created in the test folder and have to end on `*.e2e.ts`.

### Web

### Local Testing

Selenium standalone requires Java 8.0+.
To run the web E2E-tests you first have to start the web app, and then execute the e2e tests:

```
yarn workspace e2e prepare:web:start
yarn workspace e2e test:web
```

> **Note**: Running tests local on mac you have to enable safari web-driver support.
> Run the following command in your terminal:
> `/usr/bin/safaridriver --enable`

This will launch an automated chrome session where you can follow the test execution. If your don't have chrome
installed you can append `--firefox` or any other browser of your choice to the command. Chromium does not seem to work
currently. Safari also does not work on the current version (14.1).

To run a single spec file you can run

```
yarn workspace e2e test:web --spec regexp
```

### Native

### Local Testing

For you first have to build and install the app with the E2E build configuration and start the packager:

```
yarn workspace e2e prepare:native:android
yarn workspace e2e prepare:native:start
```

It is recommended to start the app once manually to avoid timeouts during local testing. After you have the app
installed and running you can execute the native E2E-tests with

```
yarn workspace e2e test:native
```

#### Selectors

Selectors are used to select an element in the app programmatically.
However, during native development most of the common selectors are not available.
Therefore, you should use the accessibility identifier for this.
Add the accessibility-id to a React component using `testID('Example-Component')`. You can query this component
with `$('~Example-Component')` in your test.

For more complex queries you should add/use a custom [Selector](../e2e-tests/native/test/Selector.ts)
using [predicate strings](https://github.com/facebookarchive/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules)
for iOS and [UiSelectors](https://developer.android.com/reference/androidx/test/uiautomator/UiSelector) for Android.

## Troubleshooting

### Cannot hide Keyboard on iOS

https://stackoverflow.com/a/54995267

> The Appium method hideKeyboard() is known to be unstable when used on iPhone devices, as listed in Appium’s currently
> known open issues. Using this method for an iOS device may cause the Appium script to hang. Appium identifies that the
> problem is because "There is no automation hook for hiding the keyboard. Rather than using this method just think about
> how a user would hide the keyboard in your app, and tell Appium to do that instead.
