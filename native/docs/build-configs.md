# Build Configs (native)

## What are build configs and which build configs are available?

See the [general information on build configs](../../build-configs/README.md).

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

To build `integreat`, `malte` and `aschaffenburg` in **production** mode, use the commands `yarn android:integreat:production`, `yarn android:malte:production`, `yarn android:aschaffenburg:production`.

### XCode (iOS Build)

To use a build config in XCode, select the corresponding xcscheme and hit run or archive as specified in the [manual builds doc](manual-builds.md#ios).
Before running the app, make sure to start the packager with the right build config as specified [above](#runtime-javascript)
as the packager started by XCode does not select a build config per default.

Not doing this will lead to [this error](troubleshooting.md#no-build_config_name-supplied).

## Technical Information

The concept and technical implementation of build configs is inspired by the library [react-native-config](https://github.com/luggit/react-native-config).

The javascript and gradle build config utilities are reading the environment variable `BUILD_CONFIG_NAME` to select the right build config,
whereas for XCode xcschemes are used as we don't have a bash command to build and install the app there.

### Javascript

To make the selected build config available in the javascript code, the [buildConfig module](../build-configs/index.js)
reads the environment variable and returns the corresponding javascript object.
If the env is not set or not a valid name, an error is thrown.

To access the values of the build config use [this method](../src/modules/app/constants/buildConfig.js).

### Native Containers

#### XCode

To make the build config available to XCode, [xcconfig files](https://nshipster.com/xcconfig/) (simple `<key> = <value>` syntax) are used as this is not possible with .js files.
Also, XCode has built in support for xcconfig files (and uses them).

In Xcode the build configs are converted with a so called `Pre Action` which is run whenever a build is made in xcode.

#### Gradle

For Gradle the build configs are converted to .json files for better typing and error handling.
In Gradle the logic behind this can be found [here](../android/app/buildConfigs.gradle).
