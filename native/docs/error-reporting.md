# Error reporting

We are using Sentry for error reporting. Sentry offers a [react-native client](https://github.com/getsentry/sentry-react-native) which is used in this project. This basically consists of three different clients:

- [sentry-java](https://github.com/getsentry/sentry-java)
- [sentry-javascript](https://github.com/getsentry/sentry-javascript) (currently uses raven-js)
- [sentry-cocoa](https://github.com/getsentry/sentry-cocoa)

**In order to use the cli a `sentry.properties` is needed which includes an auth key and information about the project.**

### Trigger a Sentry report manually

- Run a production build with `yarn android:integreat:production`
- Start the app, select a city, open settings, click the version number approximately 20 times.

# Platform specifics for crashes

## JavaScript crashes

None are known so far.

## Android Native crashes

- sentry-java buffers events when it fails to send them right after the crash. This usually happens when the app crashes the first time. In that case the event is buffered in the `cache` directory of the app (You can configure by [using these settings](https://docs.sentry.io/clients/java/config/#buffering-events-to-disk)).
- Native crashes are only sent if the app container crashes. If only an exception within JavaScript is thrown the App does not really stop. Therefore, native crashes are only reported if the app is built in release mode.

## iOS Native crashes

None are known so far.

# Releases

Only proper releases should be handled correctly by sentry. This means we do no upload source-maps for dev builds.

## Upload of source maps

Sentry needs source maps in order to display stack traces properly. These are automatically uploaded in our CI/CD pipeline. If you want to do this manually, you can [use the cli](https://docs.sentry.io/platforms/javascript/sourcemaps/#uploading-source-maps-to-sentry) to upload source maps.
You need a `sentry.properties` with a valid authentication key for this to work.
You can generate it using the cli:

```bash
yarn sentry-cli login
```

You can read [here](https://docs.sentry.io/clients/react-native/sourcemaps/) about generating sourcemaps for react-native projects or just use these commands:

### Android

Creating a bundle:

```bash
yarn react-native bundle --dev false --platform android --entry-file src/index.js --bundle-output index.android.bundle --sourcemap-output index.android.bundle.map
```

Uploading the bundle:

```bash
yarn sentry-cli releases --project integreat-react-native-app --org tur-an-tur-digitalfabrik files <release> upload-sourcemaps --dist <distribution> --strip-prefix <prefix> --rewrite index.android.bundle index.android.bundle.map
```

`<release>` is the `applicationId` concatenated with the version string e.g. `tuerantuer.app.integreat-2020.1.0`

`<distribution>` is the `versionCode` on Android.

`<prefix>` is your project directory e.g. `/home/max/projects/integreat/integreat-react-native-app/src/`

### iOS

Creating a bundle:

```bash
yarn react-native bundle --dev false --platform ios --entry-file src/index.js --bundle-output main.jsbundle --sourcemap-output main.jsbundle.map
```

Uploading the bundle:

```bash
yarn sentry-cli releases --project integreat-react-native-app --org tur-an-tur-digitalfabrik files <release> upload-sourcemaps --dist <distribution> --rewrite main.jsbundle main.jsbundle.map
```

`<release>` is the bundle identifier concatenated with the version string e.g. `de.integreat-app-2020.1.0`

`<distribution>` is the build number on iOS.

## Upload of Android debugging symbols

We are not doing this currently.

## Upload of iOS debugging symbols

We are not doing this currently.
