# Conventions

For naming we follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react). 
For the JavasScript code style we use the [standard style](https://standardjs.com/).
For git commit messages [this style](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

## Versioning
![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg) with:
* **`YYYY`** - Full year - 2006, 2016
* **`MM`** - Short month - 1, 2 ... 11, 12
* **`Minor`** - The third number in the version. For feature and bugfix releases.

## Folder structure
```
├── __mocks__
├── modules
│   └── app
│       ├── constants
│       ├── assets
│       ├── components
│       ├── containers
│       ├── actions
│       ├── hocs
│       └── reducers
└── routes
    └── route-name
│       ├── assets
│       ├── components
│       ├── containers
│       │   └── RouteNamePage.js
│       ├── actions
│       ├── hocs
│       └── reducers
```
A component always follows the following structure (Uppercase files always contain a single class):
```
├── __tests__
│   └── Caption.js
└── Caption.js
```

### Assets

Assets like icons for the native platform (e.g. Android or iOS) are managed by yo and generator-rn-toolbox. See [here](https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md) for more information.
