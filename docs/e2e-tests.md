# End-to-End Tests

The E2E-tests can be found in the [e2e-tests subdirectory](../e2e-tests).
To run the E2e-tests take a look at the commands in the [package.json](../e2e-tests/package.json).

## WebdriverIO

[WebdriverIO](https://webdriver.io/) is the framework surrounding the E2E-tests. It provides services to instantiate a local selenium server, connect to browserstack and to select the correct chromedriver. Additionally, it can be configured to run multiple E2E-tests in parallel.

> **Note**
> WebdriverIO provides selectors for react components. However, they do not work properly for internet explorer in web. Therefore, you should use more primitive selectors instead (like xpath).

## Browserstack

Browserstack provides you with a large set of available operating systems, browser, and browser versions.
To see and run the E2E tests on Browserstack you need a Browserstack account, with access to our organization.
You will need to set `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER` as environment variables, which you can find when logging in to Browserstack and selecting either the Automate or AppAutomate tab.
If you don't have this access you can still execute the tests locally with `yarn e2e:web`.
For the browserstack tests in web there are several configurations to run the tests in the specified browsers. Preferably you should run these from the commandline, e.g. `yarn wdio run web/browserstack/wdio-browserstack-safari.conf.ts` from the project root. There is also a configuration in the `package.json`, which runs all of the browserstack configurations sequentially.

## Writing Tests

The E2E-tests project does not use flow, but implements everything using [TypeScript](https://www.typescriptlang.org/).
The [E2E test folder](../e2e-tests/web/test) contains two important subdirectories:

- [PageObjects](../e2e-tests/web/test/pageobjects
- [End-to-End Tests](../e2e-tests/web/test/specs)

When writing new tests create helper classes for each Page you are using in the tests to keep the tests uniform and readable. This is also called the [page object pattern](https://webdriver.io/docs/pageobjects/).
The tests itself are then created in the test folder and have to end on `*.e2e.ts`.
