# Build Configs (native)

## What are build configs and which build configs are available?

See the [general information on build configs](../../docs/build-configs.md).

## Using a Build Config

Build configs are used in two different places: In the javascript code during runtime and in webpack during the build process.

### Runtime (Javascript)

For each build config there is a script in the [package.json](package.json) to ease the process of starting the packager:
```bash
yarn start:<build config name>
```

For the standard development build config `integreat-test-cms` there is also the shortcut `yarn start`.

To access the values of the build config import [buildConfig.js](src/modules/app/constants/buildConfig.js).

## Technical Information

The build config is loaded by webpack during [bundling and compiling the app](../tools/webpack.config.babel.js).
It is then passed as `__BUILD_CONFIG__` environment variable to the javascript code.
To access the values of the build config in javascript use [this method](src/modules/app/constants/buildConfig.js).
