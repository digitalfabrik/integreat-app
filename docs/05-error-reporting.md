# Error reporting

We are using Sentry for error reporting. Sentry offers a [react-native client](https://github.com/getsentry/react-native-sentry) which is used in this project. This basically proves 3 different clients:
* [sentry-java](https://github.com/getsentry/sentry-java)
* [sentry-javascript](https://github.com/getsentry/sentry-javascript) (currently uses raven-js)
* [sentry-cocoa](https://github.com/getsentry/sentry-cocoa)

**In order to use the cli a `sentry.properties` is needed which includes a auth key and information about the project.**


# Platform specifics for crashes

## JavaScript crashes

None are known so far.

## Android Native crashes

* sentry-java buffers events when it fails to send them right after the crash. This usually happens when the app crashes the first time. In that case the event is buffered in the `cache` directory of the app (You can configure by [using these settings](https://docs.sentry.io/clients/java/config/#buffering-events-to-disk)).
* Native crashes are only sent if the app container crashes. If only an exception within JavaScript is thrown the App does not really stop. Therefore native crashes are only reported if the app is built in release mode.

## iOS Native crashes

None are known so far.

# Releases

Only proper releases should be handled correctly by sentry. This means we do no upload source-maps for dev builds.

## Upload of source maps

Sentry wants source maps in order to display stack traces properly. We are not uploading them automatically. Instead you can [use the cli](https://docs.sentry.io/platforms/javascript/sourcemaps/#uploading-source-maps-to-sentry) to upload source maps.

## Upload of Android debugging symbols

We are not doing this currently.

## Upload of iOS debugging symbols

We are not doing this currently.
