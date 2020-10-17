# Build Configs

The concept of build configs is used to build different versions of the app. A build config defines the following (among others):
* Enabling and disabling features
* Design, fonts, icons and theme colors
* CMS Urls
* Override locales
* Store metadata

## Available Build Configs

* **integreat-test-cms**: Build config for development, very similar to integreat but using the [test cms](technical-documentation.md#test-cms).
* **integreat**: Integreat build config using the production integreat cms.
* **malte**: Build config for the Malte-App which uses a different design, name and cms.
* **integreat-e2e**: Build config for [E2E-Tests](e2e-testing.md), primarily used in the [CI](cicd.md).

**NOTE: Testing and developing with the live cms instance should be avoided. Therefore, the `integreat-test-cms` build config should be used primarily.**

## Using a Build Config

Build configs are used in two different places: In the javascript code during runtime and in gradle and XCode during the build process.
Therefore, the build config has to be defined when compiling the javascript bundle AND when building the native container.

### Runtime (Javascript)

For each build config there is a script in the [package.json](../package.json) to ease the process of starting the packager:
```bash
yarn start:<build config name>
```

For the standard development build config `integreat-test-cms` there is also the shortcut `yarn start`.

To access the values of the build config import [buildConfig.js](../src/modules/app/constants/buildConfig.js).

### Gradle (Android Build)

For each build config there is a script in the [package.json](../package.json) to ease the process of building and installing the app on android:
```bash
yarn android:<build config name>
```

For the standard development build config `integreat-test-cms` there is also the shortcut `yarn android`.

To build `integreat` and `malte` in **production** mode, use the commands `yarn android:integreat:production` and `yarn android:malte:production`.

### XCode (iOS Build)

To use a build config in XCode, select the corresponding xcscheme and hit run or archive as specified in the [manual builds doc](manual-builds.md#ios).
Before running the app, make sure to start the packager with the right build config as specified [above](#runtime-javascript)
as the packager started by XCode does not select a build config per default.

Not doing this will lead to [this error](troubleshooting.md#no-build_config_name-supplied).

## Technical Information

The concept and technical implementation of build configs is inspired by the library [react-native-config](https://github.com/luggit/react-native-config).

Each build config is a set of javascript files (possibly including common files) that can be found in the [corresponding directory](../build-configs/configs).
The javascript and gradle build config utilities are reading the environment variable `BUILD_CONFIG_NAME` to select the right build config,
whereas for XCode xcschemes are used as we don't have a bash command to build and install the app there.

### Javascript

To make the selected build config available in the javascript code, the [buildConfig module](../build-configs/index.js)
reads the environment variable and returns the corresponding javascript object.
If the env is not set or not a valid name, an error is thrown. 

To access the values of the build config use [this method](../src/modules/app/constants/buildConfig.js).

### Native Containers (Gradle and XCode)

To make the build config available to XCode and Gradle, [xcconfig files](https://nshipster.com/xcconfig/) (simple `<key> = <value>` syntax) are used as this is not possible with .js files.
Also, XCode has built in support for xcconfig files (and uses them). [Java properties](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html)
are using the same syntax (while being more powerful), so Gradle can parse the xcconfig files as java properties.

Both XCode and Gradle therefore convert the specified build config into a valid xcconfig file.
In Xcode this is done with a so called `Pre Action` which is run whenever a build is made in xcode.
In Gradle the logic behind this can be found [here](../android/app/buildConfigs.gradle).
