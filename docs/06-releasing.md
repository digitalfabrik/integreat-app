# Releasing

*This is a WIP document*

The following steps are needed to release the app:

* Tag latest git commit on master
* Create a release in Sentry and [upload source maps](05-error-reporting.md).
* Create a release in Jira so we can reference to this later.
* Create an entry in [CHANGELOG.md](../CHANGELOG.md)
* Decide whether we want to send the app to testing prior to releasing

### Android

* Build release APK using the commands used in the [Jenksinsfile](../Jenkinsfile)
* For example if you use a custom keystore you can use the command: `./gradlew -PMYAPP_RELEASE_STORE_PASSWORD=*** -PMYAPP_RELEASE_KEY_ALIAS=*** -PMYAPP_RELEASE_KEY_PASSWORD=** -PMYAPP_RELEASE_STORE_FILE=***.jks  build -x lint -x lintVitalRelease`
* Upload APK in [Developer Console](https://play.google.com/apps/publish/)

### iOS

* Archive the app using XCode and directly upload it
* Check whether the uploading worked in at [App Store Connect](https://appstoreconnect.apple.com/)

