# Integreat API-Client

Implementation of the [integreat-cms](https://github.com/Integreat/cms) endpoints ([v3](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation))
used by [native](../native) and [web](../web).

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
