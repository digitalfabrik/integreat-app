# integreat-app-web

React JS WebApp for [Integreat](https://integreat-app.de), [Malte](https://www.malteser-werke.de/malte-app.html) and [Aschaffenburg](https://aschaffenburg.app).

## Contents

- [Project Setup](#project-setup)
- [Run the App](#run-the-app)
- [CMS](#cms)
- [Build Configs](docs/build-configs.md)
- [Delivery](docs/delivery-environments.md)
- [General Repository Documentation](../README.md)

## Project Setup

_Make sure you read and followed the steps in the [general README](../README.md#project-setup)._

- Run `yarn` in the terminal to install all dependencies.
- Take a look at the [available scripts](package.json). The most important scripts are also available as IntelliJ Run Configurations.

## Run the App

- Start a local webpack dev server:

  > yarn start

- Start coding :)

### Debug the App (IntelliJ)

- Make sure that `sourceMap` is set to `true` in the [tsconfig.json](tsconfig.json).
- Start the `Debug with Chrome` IntelliJ run configuration in debug mode.
- You can now debug the webapp directly in IntelliJ.

## Run the App in Production Mode

- Create a release build:
  > yarn build --env dev_server
- Launch http-server
  > python3 -m http.server -d dist/integreat
- See results on [localhost:8000](http://localhost:8000)

_Note: Steps for other [build configs](docs/build-configs.md) differ accordingly._

### Additional Configuration

- Run > Edit Configurations > Defaults > Jest:
  - Set _Configuration file_ to _jest.config.json_
- [optional] Install the following plugins:
  - [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier)
  - [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
  - [EJS](https://plugins.jetbrains.com/plugin/index?xmlId=com.jetbrains.lang.ejs)
  -

## CMS

**Testing with the production cms should be avoided!**

In development builds, i.e. `yarn start` and the [development environments](delivery-environments.md#development), the test cms is used as default.

To change the cms, enter the following command in the console of your web browser:

> window.localStorage.setItem('api-url', <cms_url>)

The cms repository can be found [here](https://github.com/digitalfabrik/integreat-cms).
There is no up-to-date api documentation but an outdated one can be found [here](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation).

### Testing CMS Content

To test with content from the cms the **testumgebung** can be used. If you don't know how to do that, reach out to us.

### Hidden Cities

Hidden cities, especially the testumgebung, can be shown by entering the search query `wirschaffendas` in the city selection.
