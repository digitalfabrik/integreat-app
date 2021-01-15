# End-to-End Tests (web)

The E2E-tests for web can be found in the [e2e subdirectory](../e2e).
For Web, we have several E2E test configurations. 
Current configured configurations are as follows:

| Configuration | Chrome             | Firefox            | Safari             | IE11               |
|---------------|--------------------|--------------------|--------------------|--------------------|
| Local         | :heavy_check_mark: | :no_entry_sign:    | :no_entry_sign:    | :no_entry_sign:    |
| Development   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| CI            | :heavy_check_mark: | :no_entry_sign: | :heavy_check_mark: | :heavy_check_mark: |

> Why is there no configuration for Firefox in the CI?

As we have limited resources, we should limit our e2e tests to the required browsers. 
Both Chrome and Firefox were quite reliable in the past years, which allows to omit one of those.

## Browserstack

To cover most browsers the E2E-tests are executed in Browserstack. To see and run the E2E tests on Browserstack you need a Browserstack Account, with access to our organization. If you don't have this access you can still [execute the tests locally](#Local-Testing).  

## Development Testing
Development testing allows you to run the E2E-tests under the same circumstances as the CI tests. For that you need to have a browserstack account. 
Furthermore, you need to define a few Environment variables. It is recommended to create your own build configuration in IntelliJ for that. When editing the configuration you can now also set Environment Variables in the Environment Field. 
Required are:
- `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER`, which you can find when logging in to Browserstack and selecting either the Automate or AppAutomate tab
- `E2E_CONFIG` e.g. browserstack_dev_ie11 for more configs see [E2E-configurations](../e2e/config/configs.js)
After that you need to initiate the BrowserStackBinary server. For this download the recent Browserstack binary appropriate for your system and run the binary as [described here](https://www.browserstack.com/local-testing/automate). Finally, you can run the E2E-tests.
  The results should then appear on your personal automate dashboard in BrowserStack.
  
## Local Testing
Local testing requires you make the same setup as for Development Testing. Although you should omit setting `E2E_BROWSERSTACK_KEY` and `E2E_BROWSERSTACK_USER`. To run the E2E tests in the browser of your choice you will also need to setup the correct driver for that. E.g for Chrome you only need to download the corresponding [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/) and add the driver to your path. The setup of other Browsers might differ. For that consult the [selenium driver requirements documentation](https://www.selenium.dev/documentation/en/webdriver/driver_requirements/). Additionally to the Development testing setup, you now need to [download the latest selenium server build](https://www.selenium.dev/downloads/). Unzip the *.jar and execute it (e.g. from the command line). Finally, you should be able to run the E2E-tests. 

### Adding another Testing Configuration
The local testing configuration differs slightly from the development or ci test configurations. The reason for that is that browserstack as intermediate is not present and you are directly communicating with selenium itself. Therefore some Capabilities might differ. For that consult the [selenium documentation](https://www.selenium.dev/documentation/en/driver_idiosyncrasies/shared_capabilities/).

## Writing Tests
The E2E test folder contains four important subdirectories:
- [E2E-configurations](../e2e/config/configs.js)
- [Driver Setup](../e2e/driver/driver.js)
- [Helpers for Specific pages](../e2e/pages)
- [End-to-End Tests](../e2e/tests)

When writing new tests create helper classes for each Page you are using in the tests to keep the tests uniform and readable.
The tests itself are then created in the test folder and have to end on `*.e2e.js`. The web pages can be queried using [selenium-webdriver](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/).