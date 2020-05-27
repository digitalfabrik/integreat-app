# Continuous Integration and Delivery

# Workflows

Several workflows exist for different purposes. See the table below for an overview.

|Workflow|Type-checking|Jest tests|Build for E2E tests|E2E tests|Delivered to production|
|---|---|---|---|---|---|
|commit|:heavy_check_mark:|:heavy_check_mark:|:x:|:heavy_check_mark:|:x:|
|weekly|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:x:|:x:|
|bi-weekly|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:x:|:heavy_check_mark:|
|api-triggered|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:x:|-|

Whether `api-triggered` is delivered to production depends on the supplied parameters.

## About the "api-triggered" Workflow 

This workflow can be triggered using the tool `yarn trigger-pipeline` as described [below](#triggering-a-build-in-ci).
Depending on the supplied parameters the build is released to production.

### Triggering a Build in CI

If you decide to do a non-scheduled automatic release of the app the easiest way is to trigger a build in CI/CD.
First you need to get a ["Personal API token"](https://circleci.com/docs/2.0/managing-api-tokens/).
Then you can trigger a build using the tool `yarn trigger-pipeline`. If you execute it without parameters you will see the usage.


# Fastlane

Fastlane is a task-runner for triggering build relevant tasks. It offers integration with XCode and the Android SDK for building and delivering the app.

## Setup of Fastlane

* Install [Ruby >= 2.6.5](https://www.ruby-lang.org/en/documentation/installation/) (The preferred and tested way is to use [Ruby Version Manager (RVM)](https://rvm.io/)).
  * If using RVM you have to do: `rvm use ruby-2.6.5`
* Make sure `ruby --version` reports the correct version
* Run `bundle install --path vendor/bundle` in the project root, `./android/` and `./ios/`
* Run `bundle exec fastlane --version`

*Hint: You can use `export FASTLANE_SKIP_UPDATE_CHECK=true` to skip the changelog output*

## Lanes

Lanes for Android live in `./android/fastlane` and for iOS in `./ios/fastlane`. Shared lanes are in `./fastlane`.

An overview about FL lanes is available in several documents:
* [General](../fastlane/README.md#available-actions) - Responsible for delivering and uploading artifacts, bumping the version using the [deliverino GitHub bot](#deliverino-github) and sending notifications.
* [Android](../android/fastlane/README.md#available-actions) - Responsible for setting up the signing keys and building the Android app.
* [iOS](../ios/fastlane/README.md#available-actions) - Responsible for setting up the certificates and building the iOS app.

# Setup Certificates for iOS on Mac

The setup of certificates is demonstrated in section [Manual builds](06-manual-builds.md#manually-building-for-ios).

## What Types of Certificates Exist?

The certificate system of Apple seems very complex at first. Therefore, we will briefly explain the types of certificates and what the purpose is.

|Certificate Type|Usable for Development|Usable for Testing|Usable for Production|
|---|---|---|---|
|Development|:heavy_check_mark:|:x:|:x:|
|Ad-hoc|:x:|:heavy_check_mark:|:x:|
|Enterprise|:x:|:heavy_check_mark:|:heavy_check_mark:|
|App Store|:x:|:x:|:heavy_check_mark:|

Also, there are various ways to install an iOS app which require different kinds of signing:

* Via a URL which is opened in Safari
* Via App Store
* Via XCode

Development certificates are for developers who want to install the app on their devices. You have to select the devices in the Provisioning Profile at [developer.apple.com](https://developer.apple.com/account/resources/profiles/list) you want to install the app on. This means the Device ID (UDID) has to be whitelisted.

Ad-hoc certificates are for public tests with a small amount of users. The difference is that you can provide the testers a URL which they can open on their device to install it. The Device ID (UDID) still has to be whitelisted.

Enterprise certificates allow you to deliver you app within your company or have a bigger public test. It is not possible for small organisation to acquire such a certificate.

App Store certificates allows the upload of the app into the App Store. It is not possible to install a app store signed app directly on your device. It has to be uploaded to App Store Connect.

# Setup Java Keystore for Android

The setup of the JKS is demonstrated in section [Manual builds](06-manual-builds.md#manually-building-for-android).

# Determine the Next Version

The next version of the app must be determined programmatically. The tool `yarn bump-version` can be used. If you execute it without parameters you will see the usage.

The following [schema](https://calver.org/) ![versioning](https://img.shields.io/badge/calver-YYYY.M.PATCH-22bfda.svg) is used for versioning, where `PATCH` is a counter for the number of releases in the corresponding month starting with 0.
For example the first versions of 2020 are `2020.1.0`, `2020.1.1`, `2020.1.2` etc. The first release february will have the version number `2020.2.0`. 
 

# Environment Variables and Dependencies

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|BROWSERSTACK_ACCESS_KEY|Access Key for BrowserStack|Password Manager|DEADBEEF|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|BROWSERSTACK_USERNAME|Username for BrowserStack|Password Manager|123546|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|DELIVERINO_PRIVATE_KEY|Base64 encoded PEM private key|Password Manager|[Deliverino Settings](https://github.com/organizations/Integreat/settings/apps/deliverino)|[Deliverino](https://github.com/apps/deliverino)|
|SENTRY_AUTH_TOKEN|Auth Token from Sentry for uploading sourcemaps and artifacts|Generate this [in your Sentry account](https://sentry.integreat-app.de/settings/account/api/auth-tokens/) with the scope `project:releases`|deadbeef|[Sentry Authentication](https://docs.sentry.io/cli/configuration/)|
|SLACK_URL|URL which can be used to send notifications to our Slack. Keep this private!|[Deliverino Settings](https://api.slack.com/apps/A0117F1AAHZ/incoming-webhooks?)|https://hooks.slack.com/...| [Slack API](https://api.slack.com/messaging/webhooks)|

## Android Variables

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|GOOGLE_SERVICE_ACCOUNT_JSON|JSON for authentication in the Google Play Console as Release Manager. This should expire after two years.|Password Manager|{...}|[Service Account Docu](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=de)|
|CREDENTIALS_GIT_REPOSITORY_URL|Git remote URL to the credentials repository which contains the Java Keystore|Ask the team about this secret repository|git@github.com:User/credentials.git|-|
|CREDENTIALS_DIRECTORY_PATH|Path where the credentials Git repository cloned to automatically by FL|The developer can choose this freely|/tmp/credentials|-|
|CREDENTIALS_KEYSTORE_PATH|Path to the OpenSSL AES256-CBC encrypted Java Keystore file|-|/tmp/credentials/<secret>.enc|Look for the `openssl enc` command in the Android Fastlane file for more information|
|KEYSTORE_PATH|Path to the decrypted Java Keystore file|-|/tmp/keystore.jks|-|
|CREDENTIALS_KEYSTORE_PASSWORD|Password for decrypting the keystore using OpenSSL||password|-|
|KEYSTORE_KEY_ALIAS|Alias of the key within the Java Keystore|You should look in the JKS file using `keytool -list -v -keystore <jks>`|my-key|-|
|KEYSTORE_KEY_PASSWORD|Password of the key within the Java Keystore|Password Manager|123456|-|
|KEYSTORE_PASSWORD|Password of the JKS which can contain multiple keys|Password Manager|123456|-|

## iOS Variables

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|FASTLANE_USER|User for an Apple Account without 2FA for delivery|Password Manager|lutz|[Credentials](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#credentials) [Avoid 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account)|
|FASTLANE_PASSWORD|Password for the Apple Account for delivery|Password Manager|123456|[Credentials](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#credentials) [Avoid 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account)|
|MATCH_PASSWORD|Password for accessing the certificates for the iOS app using [Fastlane Match](https://docs.fastlane.tools/actions/match/)|Password Manager|123456|[Using a Git Repo](https://docs.fastlane.tools/actions/match/#git-repo-encryption-password)|

# Services

## deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up ["Protected branches"](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

## deliverino (Slack)

The Slack bot `deliverino` is responsible to notify Slack channels about releases. It posts a message for iOS and Android individually as soon as the delivery step has finished.

## Google Play Store

You can visit the management website for the Play Store [here](https://play.google.com/apps/publish/). The Google Play Console is the product by Google for managing the App Store presence.

### Adding Testers to the Beta Track

The Play Store has the concept of tracks to manage released versions of the app. The beta track is for public tests. Tests can be added via their Google E-Mail or by signing up at [play.google.com/apps/testing/tuerantuer.app.integreat](https://play.google.com/apps/testing/tuerantuer.app.integreat).

### Metadata

The CI/CD pipeline uploads and overwrites metadata during the delivery step.
You can read more about managing metadata for Android [here](https://docs.fastlane.tools/actions/supply/).

## App Store Connect

You can visit the management website for the Play Store [here](https://appstoreconnect.apple.com/). App Store Connect is the product by Apple for managing the App Store presence.

For delivery an [account without 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account) is required.

### Adding Testers to TestFlight

The [weekly and bi-weekly workflows](#workflows) make the builds directly available to TestFlights "App Store Connect Users". Those should not be confused with "External Tests" which require an approval by apple. Therefore, we currently only use "App Store Connect Users" as testers.

In order to add someone as "App Store Connect User" you have to add the Apple Account to App Store Connect and to TestFlight. This is a two-step process.

### Metadata

The CI/CD pipeline uploads and overwrites metadata during the delivery step.
You can read more about managing metadata for iOS [here](https://docs.fastlane.tools/actions/deliver/).

### Authenticating

Authentication happens by setting the `FASTLANE_USER` and `FASTLANE_PASSWORD` environment variables as documented [above](#ios-variables). For more information visit the documentation [here](https://docs.fastlane.tools/best-practices/continuous-integration/#environment-variables-to-set) and read about [2-step-verification here](https://github.com/fastlane/fastlane/blob/ee904cd332ab38ca7c1979f0ab58f9389a51fb2d/spaceship/README.md#2-step-verification).


## BrowserStack

We are using BrowserStack to run our E2E tests on real iOS and Android devices.
The general documentation about [E2E tests and BrowserStack can be found here](04-e2e.md). 

# Hints and Quirks

## CPU count aka. $TOTAL_CPUS

There is no obvious way for an application to know how many cores it has available in a CircleCI docker container. The usual ways of getting the CPU count reports the CPU count of the host. This causes out-of-memory issues as the host has a lot of cores.
Therefore, all tools must set the worker limit to `$TOTAL_CPUS`. Set this variable in the `.circleci/config.yml`.
