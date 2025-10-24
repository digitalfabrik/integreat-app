# End to End Tests

We are using Jest and Appium to run the tests.
The file `e2e-tests/native/capabilities.ts` contains the capability definitions. A set of capabilities is like a
requirement of devices you want to test against (e.g. Android 11 (which is the oldest still supported version) /iOS 11).
[Here](https://www.browserstack.com/app-automate/capabilities) is a good definition of capabilities and which
properties you can set.

## Running the tests locally

### Android

Before first starting the test:

- make sure appium is installed by running `appium --version`
- install appium android driver by running `appium driver install uiautomator2` **in the project root**.
- set the APPIUM_HOME var to ~/.appium
- make sure everything is set up correctly: `appium driver list --installed` in the e2e-tests subfolder should list uiautomator2

1. Start an emulator (only the emulator, don't need to manually start the app)
2. Start the app: `yarn prepare:native:start`
3. Install the apk on the emulator: `yarn prepare:native:android`
4. Start the tests: `yarn test:native`

### iOS

1. Create an emulator with the settings from `wdio-ios.conf.ts`; if necessary, install the driver

   1.1. If the driver isn't available anymore, update the settings in the config file to a more recent one, ideally the
   ones from `e2e-tests/native/capabilities.ts`.

2. Start the app: `yarn prepare:native:start`
3. Find your build file folder: Product > Copy Build Folder Path
4. Add the BUILD_DIR to your environment. In zshell you do this via `BUILD_DIR=your/copied/build/folder/path; export BUILD_DIR` but your command line might differ.
5. Run tests via `yarn test:native:ios`

### Using Appium Inspector

When writing tests, it may be helpful to use the (Appium Inspector)[https://github.com/appium/appium-inspector] to
inspect the tree of the app.

1. Download Appium Inspector from the releases
2. Start an Appium server by running `appium` in command your line. Note the URLs your command line prints for
   accessing the server.
3. Fill one of those URLs into the host field. If you want to get to a specific route, fill in the path as well.
4. Fill in keys and values of desired capabilities: deviceName, platformVersion, automationName, platformName. You
   can find examples of those in the two files named `capabilities.ts` or `wdio-ios.conf.ts`.
5. Click on "Start Session".

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

From now on the upload will be called `MyApp`. By re-uploading you are overwriting the file.

#### Running the tests

To run tests on browserstack environment like browserstack do:

```
E2E_CONFIG=browserstack_dev_android \
E2E_BROWSERSTACK_USER=user E2E_BROWSERSTACK_KEY=key E2E_BROWSERSTACK_APP=MyApp \
yarn test:e2e
```

#### BrowserStack

Please note that there is a limit of concurrent tasks **AND** how many tasks can be queued. If you want to experiment
with this you can run jest with `--maxWorkers=15`.

- [BrowserStack API](https://www.browserstack.com/app-automate/rest-api)

## Troubleshooting

### Missing env variable ANDROID_HOME

If you get complaints about missing env variable ANDROID_HOME, add it to the shell environment. In zshell, you to this
via `ANDROID_HOME=~/Library/Android/sdk; export ANDROID_HOME` but your terminal might differ.

### Lots of timeouts

If you get lots of timeouts, start the app manually once on the emulator you want to use.

### Can't open Appium Inspector because Apple can't check for malicious software

If you get a nasty-looking error when trying to open Appium Inspector on a Mac that says that Apple can't check it
for malicious software and to contact the developer, try opening it by going to its location in Finder, right-clicking
it > Open, you now get that error again. Click the error away and right-click again, then Open, you should now have a
different warning that lets you open the app.

# Webdriver

The API spec of wd can be found [here](https://github.com/admc/wd/blob/master/doc/api.md) and general
information [here](https://github.com/admc/wd).
