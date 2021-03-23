# Continuous Integration and Delivery

## Content

* [Deliver a new release by triggering the CI](#triggering-a-delivery-using-the-ci)
* [Workflows](#workflows)
* [Services](#services)
* [Fastlane](#fastlane)
* [Determining the next version](#determining-the-next-version)
* [Environment variables](#environment-variables-and-dependencies)
* [Hints and quirks](#hints-and-quirks)

## Triggering a Delivery using the CI

The easiest way to deliver a new build to production or development is to trigger the corresponding CircleCI workflows *triggered_native_development_delivery* and *triggered_production_delivery*:

* Get a CircleCI [Personal API Token](https://circleci.com/docs/2.0/managing-api-tokens/).
* Trigger a delivery using the tool [trigger-pipeline](.circleci/trigger-pipeline).
  * If no branch is specified, main is used as default. This should normally not be changed.
  * Per default a development delivery is made.
  * For more information on how to use it, execute it without parameters to see usage information.

## Workflows

Several workflows exist for different purposes:
* **commit**: Executed for all commits of PRs to ensure good code quality and working code. Delivers web development builds to https.//webnext.\<domain>.
* **scheduled_native_promotion**: Promotes the latest native development builds to production. Executed every Thursday morning.
* **scheduled_delivery**: Delivers native builds to development and web builds to production. Executed every Thursday morning.
* **triggered_native_development_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers native builds to development.
* **triggered_production_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers web and native builds to production.

See the table below for a more detailed overview:

|Workflow|Checks|E2E tests|native delivery|web delivery|Version bump|Move release notes|
|---|---|---|---|---|---|---|
|commit|:heavy_check_mark:|:heavy_check_mark:|:x:|development (main only)|:x:|:x:|
|scheduled_native_promotion|:x:|:x:|promotion|:x:|:x:|:x:|
|scheduled_delivery|:heavy_check_mark:|:heavy_check_mark:|development|production|:heavy_check_mark:|:heavy_check_mark:|
|triggered_native_development_delivery|:heavy_check_mark:|:heavy_check_mark:|development|:x:|:heavy_check_mark:|:x:|
|triggered_production_delivery|:heavy_check_mark:|:heavy_check_mark:|production|production|:heavy_check_mark:|:heavy_check_mark:|

Steps executed if *Checks* is checked :heavy_check_mark::
* Linting
* Prettier formatting
* Flow type checking
* Unit testing with jest
* Building the app

Steps executed if *Version bump* is checked :heavy_check_mark::
* Jira release
* Bump version: Bump the version(s) and create a tag and release on github

## Services

### deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up [Protected branches](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

### Google Play Store

You can visit the management website for the Play Store [here](https://play.google.com/apps/publish/). The Google Play Console is the product by Google for managing the App Store presence.

#### Adding Testers to the Beta Track

The Play Store has the concept of tracks to manage released versions of the app. The beta track is for public tests. Tests can be added via their Google E-Mail or by signing up at [play.google.com/apps/testing/tuerantuer.app.integreat](https://play.google.com/apps/testing/tuerantuer.app.integreat).

#### Metadata

The CI/CD pipeline uploads and overwrites metadata during the delivery step.
You can read more about managing metadata for Android [here](https://docs.fastlane.tools/actions/supply/).

### App Store Connect

You can visit the management website for the Play Store [here](https://appstoreconnect.apple.com/). App Store Connect is the product by Apple for managing the App Store presence.

For delivery an [account without 2FA](https://github.com/fastlane/fastlane/blob/b121a96e3e2e0bb83392c130cb3a088c773dbbaf/spaceship/docs/Authentication.md#avoid-2fa-via-additional-account) is required.

#### Adding Testers to TestFlight

The [scheduled_native_production_workflow](#workflows) makes the builds directly available to TestFlights "App Store Connect Users". Those should not be confused with "External Tests" which require an approval by apple. Therefore, we currently only use "App Store Connect Users" as testers.

In order to add someone as "App Store Connect User" you have to add the Apple Account to App Store Connect and to TestFlight. This is a two-step process.

#### Metadata

The CI/CD pipeline uploads and overwrites metadata during the delivery step.
You can read more about managing metadata for iOS [here](https://docs.fastlane.tools/actions/deliver/).

#### Authenticating

Authentication happens by setting the `APP_STORE_CONNECT_API_KEY_CONTENT` environment variable as documented [above](#ios-variables). For more information visit the documentation [here](https://docs.fastlane.tools/app-store-connect-api/).

### BrowserStack

We are using BrowserStack to run our E2E tests on real iOS and Android devices.
The general documentation about E2E tests and BrowserStack for native development can be found [here](../native/docs/e2e-testing.md). 

## Fastlane

Fastlane is a task-runner for triggering build relevant tasks. It offers integration with XCode and the Android SDK for building and delivering the app.

### Fastlane Setup

* Install [Ruby >= 2.6.5](https://www.ruby-lang.org/en/documentation/installation/)
  * The preferred and tested way is to use the [Ruby Version Manager (RVM)](https://rvm.io/).
  * If using RVM you have to run: `rvm use ruby-2.6.5`.
* Make sure `ruby --version` reports the correct version.
* Run `bundle install --path vendor/bundle` in the project root **AND** in `./android/` **AND** in `./ios/`.
* Run `bundle exec fastlane --version`.

*Hint: You can run `export FASTLANE_SKIP_UPDATE_CHECK=true` to skip the changelog output.*

### Lanes

Lanes for Android live in [./native/android/fastlane](./native/android/fastlane) and for iOS in [./native/ios/fastlane](./native/ios/fastlane).
Shared lanes are in [./native/fastlane](./native/ios/fastlane).

An overview about FL lanes is available in several documents:
* [General](../native/fastlane/README.md#available-actions) - Responsible for delivering and uploading artifacts.
* [Android](../native/android/fastlane/README.md#available-actions) - Responsible for setting up the signing keys and building the Android app.
* [iOS](../native/ios/fastlane/README.md#available-actions) - Responsible for setting up the certificates and building the iOS app.

## Apple Certificates and Android Keystore

Fastlane is used to setup certificates and keystores. The detailed steps of the CI/CD pipeline are the same as those when manually building the app.
Therefore, you can follow the documentation for Manual Builds to set up [certificates for iOS](../native/docs/manual-builds.md#certificates-setup) and [keystores for android](../native/docs/manual-builds.md#keystore-setup).

## Determining the Next Version

The next version of the app must be determined programmatically. The tool [next-version](../tools/next-version) can be used.
More information on the version naming schema used can be found [here](docs/conventions.md#versioning).

## Environment Variables and Dependencies

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|BROWSERSTACK_ACCESS_KEY|Access Key for BrowserStack|Password Manager|DEADBEEF|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|BROWSERSTACK_USERNAME|Username for BrowserStack|Password Manager|123546|[Appium REST API](https://www.browserstack.com/app-automate/rest-api)|
|DELIVERINO_PRIVATE_KEY|Base64 encoded PEM private key|Password Manager|[Deliverino Settings](https://github.com/organizations/Integreat/settings/apps/deliverino)|[Deliverino](https://github.com/apps/deliverino)|
|SENTRY_AUTH_TOKEN|Auth Token from Sentry for uploading sourcemaps and artifacts|Generate this [in your Sentry account](https://sentry.integreat-app.de/settings/account/api/auth-tokens/) with the scope `project:releases`|deadbeef|[Sentry Authentication](https://docs.sentry.io/cli/configuration/)|
|MM_WEBHOOK|URL which can be used to send notifications to our mattermost. Keep this private!|Mattermost server settings|https://chat.tuerantuer.org/hooks/...| [Mattermost Documentation](https://docs.mattermost.com/developer/webhooks-incoming.html)|

### Android Variables

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

### iOS Variables

|Variable|Description|Where do I get it from?|Example|Reference|
|---|---|---|---|---|
|APP_STORE_CONNECT_API_KEY_ID|Key ID for App Store Connect API|Password Manager|D83848D23|[app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/)|
|APP_STORE_CONNECT_API_ISSUER_ID|Issuer ID for App Store Connect API|Password Manager|227b0bbf-ada8-458c-9d62-3d8022b7d07f|[app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/)|
|APP_STORE_CONNECT_API_KEY_CONTENT|Key content for App Store Connect API|Password Manager|-----BEGIN EC PRIVATE KEY-----\nfewfawefawfe\n-----END EC PRIVATE KEY-----|[app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/)|
|MATCH_PASSWORD|Password for accessing the certificates for the iOS app using [Fastlane Match](https://docs.fastlane.tools/actions/match/)|Password Manager|123456|[Using a Git Repo](https://docs.fastlane.tools/actions/match/#git-repo-encryption-password)|

## Skipping specific jobs

You can control which jobs should be skipped through environment variables. 
Set the variable `SKIP_JOB_deliver_aschaffenburg_ios` to `"aschaffenburg"` to skip the job with the name `deliver_aschaffenburg_ios`.
You can also set it to `"malte|aschaffenburg"` in order to match multiple build configs or to `"all"` to match all build configs.

Environment variables can be set in the [Project Settings](https://app.circleci.com/settings/project/github/Integreat/integreat-app/environment-variables) of CircleCI.

**Note: Some jobs like `bump_version` run only once for multiple build configs. Therefore, it does not make sense to set `SKIP_JOB_bump_version` to something other than `"all"`.**

**Note: Most of the time job names contain the build config name as well, therefore setting e.g. the environment variable `SKIP_JOB_deliver_ios` won't work.**

## Hints and Quirks

### CPU count aka. $TOTAL_CPUS

There is no obvious way for an application to know how many cores it has available in a CircleCI docker container. The usual ways of getting the CPU count reports the CPU count of the host. This causes out-of-memory issues as the host has a lot of cores.
Therefore, all tools must set the worker limit to `$TOTAL_CPUS`. Set this variable in the `.circleci/config.yml`.
