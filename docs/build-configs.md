# Build Configs

The concept of build configs is used to build different versions of the app. A build config defines the following (among others):
* Enabling and disabling features
* Design, fonts, icons and theme colors
* CMS Urls
* Override locales
* Store metadata

## Available Build Configs

Multiple build configs are available:
* **integreat**: Integreat build config with the production cms.
* **malte**: Build config for the Malte-App which uses a different design, name and cms.
* **integreat-test-cms**: Build config for development, very similar to integreat but using the [test cms](technical-documentation.md#test-cms).
* **integreat-e2e**: Build config for [E2E-Tests](e2e-testing.md), primarily used in the [CI](cicd.md).

## Using a Build Config

Build configs are used in two different places: In the javascript code during runtime and in the xcode and gradle during the build process.

### Runtime (Javascript)

To choose a build config, set the environment variable `BUILD_CONFIG_NAME` before starting the packager, e.g.
```bash
cross-env BUILD_CONFIG_NAME='integreat-test-cms' react-native start --reset-cache
```

There are several scripts defined in the [package.json](../package.json) to do this:

### XCode (iOS Build)

### Gradle (Android Build)


Therefore, the build config has to be defined when running the bundler AND when building the app.

## Technical Information

Each build config is a .js files that can be found [here](../build-configs/configs).
