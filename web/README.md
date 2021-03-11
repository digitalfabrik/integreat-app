# integreat-app-web

React JS WebApp for [Integreat](https://integreat-app.de), [Malte](https://www.malteser-werke.de/malte-app.html) and [Aschaffenburg](https://aschaffenburg.app)

## Contents

- [Project Setup](#project-setup)
- [Run the App](#run-the-app)
- [Troubleshooting](#trouble-shooting)
- [Build Configs](docs/build-configs.md)
- [Technical Documentation](docs/technical-documentation.md)
- [Supported Browsers](docs/supported-browsers.md)
- [Delivery](docs/delivery.md)
- [General Repository Documentation](../README.md)

## Project Setup

_Make sure to have read and followed the steps in the [general README](../README.md#project-setup)._

- Run `yarn` in the terminal to install all dependencies.
- Take a look at the [available scripts](package.json). The most important scripts are also available as IntelliJ Run Configurations.

### Run the App

- Run `yarn start` to start a local webpack dev server.
- Start coding :)

#### Run the App in production mode

- Create a release build with `yarn build ----env.dev_server`
- Launch http-server in /web/dist/integreat by running `python3 -m http.server`
- See results on [localhost:8000](http://localhost:8000)
- Note: Steps for other build configs differ accordingly

### Additional Configuration

- Run > Edit Configurations > Defaults > Jest:
  - Set _Configuration file_ to _jest.config.js_
- Settings > Languages & Frameworks > JavaScript:
  - Choose _Flow_ as Language version
  - Set _Flow package or executable_ to _<project_dir>/node_modules/flow-bin_
- [optional] Associate the _\*.snap_ files with the file type _JavaScript_.
- [optional] Install the following plugins:
  - [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
  - [EJS](https://plugins.jetbrains.com/plugin/index?xmlId=com.jetbrains.lang.ejs)

## Trouble Shooting

- Use nodejs 12 LTS instead of the latest version.
