# Build Configs

We use the concept of build configs to build different versions of the app. A build config defines for example the following aspects:
* Enabling and disabling of features
* Design, fonts, icons and theme colors
* Backend urls
* Override translations
* Store metadata

## Contents

* [Available Build Configs](#available-build-configs)
* [Usage](#usage)
* [Structure and Available Options](#structure-and-available-options)
* [Technical Information](#technical-information)
* [Whitelabelling](#whitelabelling)

## Available Build Configs

* **integreat**: Build config for [Integreat](https://integreat-app.de).
* **malte**: Build config for [Malte](https://www.malteser-werke.de/malte-app.html).
* **aschaffenburg/abapp**: TODO 
* **integreat-test-cms**: Build config for development using the test cms and with additional features enabled.
* **integreat-e2e**: Build config for [E2E-Tests](../native/docs/e2e-testing.md), primarily used in the [CI](../docs/cicd.md).

**NOTE: Testing and developing with the live cms instance should be avoided.
Therefore, the `integreat-test-cms` build config should be used primarily.**

## Usage

See the corresponding sections for [native](../native/docs/build-configs.md#using-a-build-config) and [web](../web/docs/build-configs.md#using-a-build-config).

## Structure and Available Options

See the [build config types](./BuildConfigType.js) for more information on structure, available options and their functionality.

## Technical Information

Each build config is a set of javascript files (possibly including common files) that can be found in the [corresponding directory](../build-configs/configs).
See the corresponding sections for [native](../native/docs/build-configs.md#technical-information) and [web](../web/docs/build-configs.md#technical-information).

## Whitelabelling

If you want to add more build configs in order to create a new whitelabelled app, have a look at the [whitelabelling docu](../docs/whitelabelling.md).
