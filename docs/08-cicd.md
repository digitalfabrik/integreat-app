# Continuous Integration and Delivery

# Fastlane

## Setup

## Lanes

### Android

### iOS

# Environment variables and dependencies

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|BROWSERSTACK_ACCESS_KEY|Access Key for BrowserStack|Password Manager|steffen|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|BROWSERSTACK_USERNAME|Username for BrowserStack|Password Manager|123546|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|DELIVERINO_PRIVATE_KEY|Base64 encoded PEM private key|Password Manager|[Deliverino Settings](https://github.com/settings/apps/deliverino)|[Deliverino](https://github.com/apps/deliverino)|
|SENTRY_AUTH_TOKEN|Auth Token from Sentry for uploading sourcemaps and artifacts|Generate this [in your Sentry account](https://sentry.integreat-app.de/settings/account/api/auth-tokens/) with the scope `project:releases`|deadbeef|[Sentry Authentication](https://docs.sentry.io/cli/configuration/)|
|SLACK_URL|URL which can be used to send notifications to our Slack. Keep this private!|[Deliverino Settings](https://api.slack.com/apps/A0117F1AAHZ/incoming-webhooks?)|https://hooks.slack.com/...| [Slack API](https://api.slack.com/messaging/webhooks)|

## Android

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|GOOGLE_SERVICE_ACCOUNT_JSON|JSON for authentication in the Google Play Console as Release Manager. This should expire after two years.|Password Manager|{...}|[Service Account Docu](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=de)|
|CREDENTIALS_GIT_REPOSITORY_URL|Git remote URL to the credentials repository whihc contains the Java Keystore|-|git@github.com:User/credentials.git|-|
|CREDENTIALS_DIRECTORY_PATH|Path where the credentials Git repository cloned to|-|/tmp/credentials|-|
|CREDENTIALS_KEYSTORE_PATH|Path to the OpenSSL AES256-CBC encrypted Java Keystore file|-|/tmp/credentials/<secret>.enc|Look for the `openssl enc` command in the Android Fastlane file for more information|
|KEYSTORE_PATH|Path to the decrypted Java Keystore file|-|/tmp/keystore.jks|-|
|CREDENTIALS_KEYSTORE_PASSWORD|Password for decrypting the keystore using OpenSSL||password|-|
|KEYSTORE_KEY_ALIAS|Alias of the key within the Java Keystore|You should look in the JKS file using `keytool -list -v -keystore <jks>`|my-key|-|
|KEYSTORE_KEY_PASSWORD|Password of the key within the Java Keystore|Password Manager|123456|-|
|KEYSTORE_PASSWORD|Password of the JKS which can contain multiple keys|Password Manager|123456|-|

## iOS

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|FASTLANE_USER|User for an Apple Account without 2FA for delivery|Password Manager|lutz|[Credentials](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#credentials) [Avoid 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account)|
|FASTLANE_PASSWORD|Password for the Apple Account for delivery|Password Manager|123456|[Credentials](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#credentials) [Avoid 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account)|
|MATCH_PASSWORD|Password for accessing the certificates for the iOS app using [Fastlane Match](https://docs.fastlane.tools/actions/match/)|Password Manager|123456|[Using a Git Repo](https://docs.fastlane.tools/actions/match/#git-repo-encryption-password)|

# Scheduled workflows

# Manual deployment

## iOS

## Android

`export CREDENTIALS_GIT_REPOSITORY_URL=<secret>`
`export CREDENTIALS_DIRECTORY_PATH=/tmp/credentials`
`export CREDENTIALS_KEYSTORE_PASSWORD=<secret>`
`export CREDENTIALS_KEYSTORE_PATH=/tmp/credentials/<secret>.enc`
`export KEYSTORE_PATH=/tmp/keystore.jks`
`fastlane keystore`

`export KEYSTORE_KEY_ALIAS=<secret>`
`export KEYSTORE_PASSWORD=<secret>`
`export KEYSTORE_KEY_PASSWORD=<secret>`
`fastlane build`

`adb install app/build/outputs/apk/release/app-release.apk`
`adb shell am force-stop tuerantuer.app.integreat`
`adb shell am start -n tuerantuer.app.integreat/.MainActivity`

# Credentials and services

## deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot updates the repository when a new release is delivered.

Access to the Bot is granted by a Private Key in PEM format. This is used to get an access token for an installation. This access_token allows to write content to the repositories/organisations where it was installed.

// PEM is base64 encoded
// Disable "Include Administrators" in Protected Branches (GitHub App is Admin)

## deliverino (Slack)

## Google Play Store

### Adding users to 'beta' channel

### Metadata

`bundle exec fastlane supply`

## App Store Connect

For delivery an [account without 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account) is required.

### TestFlight: Adding users to 'beta' channel

Add to "App Store Connect Users"

### Metadata

`bundle exec fastlane deliver`

### Authenticating via spaceauth
https://docs.fastlane.tools/best-practices/continuous-integration/#environment-variables-to-set
https://github.com/fastlane/fastlane/tree/master/spaceship#2-step-verification

## BrowserStack



## Slack Bot "deliverino"


# Hints and quirks

## CPU count aka. $TOTAL_CPUS

There is no obvious way for an application to know how many cores it has available in a CircleCI docker container. The usual ways of getting the CPU count reports the CPU count of the host. This causes out-of-memory issues as the host has a lot of cores.
Therefore, all tools must set the worker limit to `$TOTAL_CPUS`. Set this variable in the `.circleci/config.yml`.
