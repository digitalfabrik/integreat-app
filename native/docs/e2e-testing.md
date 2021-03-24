# End to End Tests

We are using Jest and Appium to run the tests.
The `e2e-tests/config/configs.js` contains the urls to the Appium servers and the capability definitions. A set of capabilities is like a requirement of devices you want to test against (e.g. Android 9/iOS 11). [Here](https://www.browserstack.com/app-automate/capabilities) is a good definition of capabilities and which caps you can set.

## Setup

To run the tests locally you first need to setup an Appium server. You can [read here](https://github.com/appium/appium/blob/master/docs/en/about-appium/getting-started.md) how to do this. Start `appium` and an emulator/simulator.

### Building the app for e2e tests

To build for e2e tests, use the [corresponding build config](../../build-configs/integreat-e2e).

### Using appium-desktop

[Appium Desktop](https://github.com/appium/appium-desktop) allows you to inspect the tree of the app. To set it up I recommend to clone the repository and run the electron app manually:

```bash
git clone https://github.com/appium/appium-desktop.git
cd appium-desktop
npm install
cd ..
electron .
```

### Running tests locally

To run tests locally do: `E2E_CONFIG=local_android yarn test:e2e`

### Running tests on browserstack

You can find your browserstack `user` and `key` here: https://app-automate.browserstack.com/

#### Uploading the app

You can upload the app and give the upload a name by running:

```bash
curl -u "user:key" \
-X POST "https://api-cloud.browserstack.com/app-automate/upload" \
-F "file=@/path/to/app/file/Application-debug.apk" \
-F "data={\"custom_id\": \"MyApp\"}"
```

From now on the upload will be called `MyApp`. By re-uploading you are overriding the file.

#### Running the tests

To run tests on browserstack environment like browserstack do:

```
E2E_CONFIG=browserstack_dev_android \
E2E_BROWSERSTACK_USER=user E2E_BROWSERSTACK_KEY=key E2E_BROWSERSTACK_APP=MyApp \
yarn test:e2e
```

#### BrowserStack

Please note that there is a limit of concurrent tasks **AND** how many tasks can be queued. If you want to experiment with this you can run jest with `--maxWorkers=15`.

- [BrowserStack API](https://www.browserstack.com/app-automate/rest-api)

# Webdriver

The API spec of wd can be found [here](https://github.com/admc/wd/blob/master/doc/api.md) and general information [here](https://github.com/admc/wd).
