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

To access the values of the build config import [buildConfig.js](../src/constants/buildConfig.ts).

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
All conversions are done with the [manage.ts script](../build-configs/tools/manage.ts).

### Javascript

To make the selected build config available in the javascript code, we map the non-existing module `build-config-name`
to the right name constant in the corresponding build config directory in the [build-configs workspace](../build-configs),
e.g. [this file](../build-configs/integreat/build-config-name/index.ts) for Integreat.
This is done with a proxy in the [metro config](../metro.config.js) in the `extraNodeModules` prop.

To access the values of the build config use [this method](../src/constants/buildConfig.ts).

### Native Containers

#### XCode

For XCode we use hard coded xcschemes `Pre Actions` that select and convert the right build config to [xcconfig files](https://nshipster.com/xcconfig/).
Xcconfig files use a simple `<key> = <value>` syntax XCode has built in support for (and uses them).

#### Gradle

For Gradle the build config matching the `BUILD_CONFIG_NAME` environment variable is converted to a `.json` file for better typing and error handling.
In Gradle the logic behind this can be found [here](../android/app/buildConfigs.gradle).
