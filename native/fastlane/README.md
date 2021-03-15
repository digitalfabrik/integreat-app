# fastlane documentation

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using

```
[sudo] gem install fastlane -NV
```

or alternatively using `brew install fastlane`

# Available Actions

## Android

### android browserstack_upload_live

```
fastlane android browserstack_upload_live
```

Upload the APK to BrowserStack Live

### android browserstack_e2e_tests

```
fastlane android browserstack_e2e_tests
```

Upload the APK and run E2E tests on BrowserStack

### android playstore_upload

```
fastlane android playstore_upload
```

Deliver the app to Play Store. Depending on the option `production_delivery` the update is released to the general
public.

### android playstore_promote

```
fastlane android playstore_promote
```

Promote the most recent version in the beta track to the production track in the Play Store.

---

## iOS

### ios browserstack_upload_live

```
fastlane ios browserstack_upload_live
```

Upload the IPA to BrowserStack Live

### ios browserstack_e2e_tests

```
fastlane ios browserstack_e2e_tests
```

Upload the IPA and run E2E tests on BrowserStack

### ios appstoreconnect_upload

```
fastlane ios appstoreconnect_upload
```

Deliver the app to App Store Connect. The app is submitted for review and released automatically.

### ios testflight_upload

```
fastlane ios testflight_upload
```

Deliver the app to TestFlight for testers

### ios appstoreconnect_promote

```
fastlane ios appstoreconnect_promote
```

Promote the app from testflight to production in App Store Connect.

### ios prepare_release_notes

```
fastlane ios prepare_release_notes
```

Prepare release notes

---

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run. More
information about fastlane can be found on [fastlane.tools](https://fastlane.tools). The documentation of fastlane can
be found on [docs.fastlane.tools](https://docs.fastlane.tools).
