# Integreat API-Client

Implementation of the [integreat-cms](https://github.com/Integreat/cms) endpoints ([v3](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation))
used by the [integreat-webapp](https://github.com/Integreat/integreat-webapp) and [integreat-react-native-app](https://github.com/Integreat/integreat-react-native-app).

Tasks of the API-Client:
* Simple usage of the different endpoints
* Fetching data from the cms
* Mapping of the JSON responses to our internal models
* Sorting and filtering when necessary
* Posting feedback

## Testing and Debugging
Apart from testing with unit tests you can test or debug your changes with the frontend of your choice:
* Run `yarn build`.
* Replace the content of `node_modules` > `@integreat-app` > `integreat-api-client` in the frontend with the content of the generated `dist` folder.

With bash you can use the following command from the parent directory to do so:
```bash
yarn --cwd integreat-api-client/ build && cp -R integreat-api-client/dist/. <frontend>/node_modules/@integreat-app/integreat-api-client/
```
This assumes:
* `<frontend>` is either `integreat-webapp` or `integreat-react-native-app`.
* `integreat-api-client` and `<frontend>` are both in the same directory.

## Releasing
* Bump the version number in the `package.json`.
    * Create a PR to the `master` branch.
    * Merge the PR, if necessary using admin privileges.
* Run `yarn build`.
* Navigate to the created `dist` folder (`cd dist`).
* Make sure all necessary changes are present in the generated output:
    * Bumped version number.
    * Changes to be released.
* Run `yarn publish`. Make sure to run this only from the `dist` folder.
    
NOTE: **Publishing is only possible once per version number**, so make sure everything is correct before running `yarn start`.


