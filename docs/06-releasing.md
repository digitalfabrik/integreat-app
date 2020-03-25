# Releasing

*This is a WIP document*

The following steps are needed to release the app:

* Tag latest git commit on master
* Create a release in [Sentry](https://sentry.integreat-app.de) by [uploading source maps](05-error-reporting.md).
* Create a release in Jira so we can reference to this later.
* Create an entry in [CHANGELOG.md](../CHANGELOG.md)
* Decide whether we want to send the app to testing prior to releasing

### Android
For building the Release Android App Bundle, you need the corresponding keystore file:
For further information regarding the keystore have a look at the `keystore_integreat.txt` in the drive.
You need to place the keystore file in the `android/app` folder.

* Increment the `versionCode` in the [build.gradle](../android/app/build.gradle)
* For building the Release Android App Bundle use the following command:
  ```bash
    ./gradlew -PKEYSTORE_PATH=<store_file> -PKEYSTORE_PASSWORD=<store_pw> -PKEYSTORE_KEY_ALIAS=<key_alias> -PKEYSTORE_KEY_PASSWORD=<key_pw> bundleRelease
  ```

  `<store_file>` is the filename of the keystore file.

  `<store_pw>` is the password of the keystore file.

  `<key_alias>` is the alias of the key in the keystore that the bundle should be signed with.

  `<key_pw>` is the password for the key in the keystore.

* Upload the `.aab` in [Developer Console](https://play.google.com/apps/publish/)

#### Known issues
* Upon receiving the error `java.io.UncheckedIOException: java.io.IOException: Execution of compression failed.` during the build process, just restart your computer.
  If this does not help, try increasing the maximum memory by adding `org.gradle.jvmargs=-Xmx4608M` to gradle.properties.

### iOS

* Archive the app using XCode (Product > Archive) and directly upload it (using xcode)
* Check whether the uploading worked in at [App Store Connect](https://appstoreconnect.apple.com/)

