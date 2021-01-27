# End-to-End Tests (Web)

The E2E-tests for Web can be found in the [e2e subdirectory](../e2e).
There are 3 test setups: local, dev and ci. The local and ci configurations interact directly with selenium and don't include communication with browserstack. 
In contrast to that, the dev configuration does communicate with browserstack, which allows to test any browser and any system we want.

## Selenium
Selenium is a service that provides a range of tools to interact with browsers and automate E2E tests.
To use Selenium for testing we need a Selenium Server, a WebDriver to interact with the server and the driver for the respected browser.
Information on how these components interact with each other can be found in the [Selenium documentation](https://www.selenium.dev/documentation/en/webdriver/understanding_the_components/).


### Local Testing
For local testing you need a recent [Selenium Server Standalone](https://selenium-release.storage.googleapis.com/index.html) jar.
Furthermore, you need to download the driver for your browser and add it to your Path. (https://www.selenium.dev/documentation/en/webdriver/driver_requirements/)
Start the selenium in your commandline with `java -jar selenium-server-standalone-<version>.jar`.
After that run the e2e tests with `yarn test:e2e`.


## Browserstack

Browserstack provides you with a large set of available operating systems, browser, and browser versions.
To see and run the E2E tests on Browserstack you need a Browserstack Account, with access to our organization. 
If you don't have this access you can still [execute the tests locally](#Local-Testing). 
Browserstack also interacts with selenium internally, but due to limited resources we decided against it for our web E2E tests.

### Development Testing
Development testing includes running the tests in browserstack. For that you need to have a browserstack account.
Furthermore, you need to define a few Environment variables. It is recommended to create your own build configuration in IntelliJ for that. When editing the configuration you can now also set Environment Variables in the Environment Field.
Required are:
- `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER`, which you can find when logging in to Browserstack and selecting either the Automate or AppAutomate tab
- `E2E_CONFIG` e.g. browserstack_dev_ie11 for more configs see [E2E-configurations](../e2e/config/configs.js)
  After that you need to initiate the BrowserStackBinary server. For this download the recent Browserstack binary appropriate for your system and run the binary as [described here](https://www.browserstack.com/local-testing/automate). Finally, you can run the E2E-tests.
  
You can then start your test using the command `yarn test:e2e`.
The results should appear on your personal automate dashboard in BrowserStack.

## Writing Tests
The E2E test folder contains four important subdirectories:
- [E2E-configurations](../e2e/config/configs.js)
- [Driver Setup](../e2e/driver/driver.js)
- [Helpers for Specific pages](../e2e/pages)
- [End-to-End Tests](../e2e/tests)

When writing new tests create helper classes for each Page you are using in the tests to keep the tests uniform and readable.
The tests itself are then created in the test folder and have to end on `*.e2e.js`. The web pages can be queried using [selenium-webdriver](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/).