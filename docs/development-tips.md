# Development Tips and Tricks

This is a file in which we can collect some tricks that we might otherwise just put in private note files.
We have a file to share these in instead here.

### Changing the API in the web app

In the browser console, run `window.localStorage.setItem('api-url', 'https://cms-test.integreat-app.de')`
or whichever API (e.g. ''https://cms.integreat-app.de) you want to call. You can also do it manually in
the local storage of the browser.

See also [here](../web/README.md#cms).

### Triggering a deployment

In `/tools`, use the following command: `yarn trigger-pipeline trigger <workflow from trigger-pipeline.ts>—api-token <CircleCI token>`.

See also [here](./cicd.md#triggering-a-delivery).

### Opening a URL in the native app

For Android: `npx uri-scheme open https://integreat.app/etc/pp/ --android`

For iOS: `npx uri-scheme open integreat://integreat.app/etc/pp/ --ios`

### Moving keys between namespaces in translations.json

If you e.g. want to move the key "back" from the namespace "events" to "common":

1. Export the constants: `yarn manage convert translations.json translations-csv csv`
2. Search and replace all usages of "namespace_old.key" with "namespace_new.key" in all exported csvs (e.g. events.back with common.back)
3. Import the constants again: `yarn manage convert translations-csv translations.json json`
4. Don't forget to change the usages in native and web
