# Continuous Integration and Delivery

## Content

* [Deliver a new release by triggering the CI](#triggering-a-delivery-using-the-ci)
* [Workflows](#workflows)
* [Fastlane](#fastlane)
* [Determining the next version](#determining-the-next-version)
* [Environment variables](#environment-variables-and-dependencies)
* [Used services](#services)
* [Hints and quirks](#hints-and-quirks)

## Triggering a Delivery using the CI

The easiest way to deliver a new build to production or development is to trigger the corresponding CircleCI workflow *triggered_production_delivery*:

* Get a CircleCI [Personal API Token](https://circleci.com/docs/2.0/managing-pi-tokens/).
* Trigger a delivery using the tool [trigger-pipeline.sh](.circleci/trigger-pipeline).
If no branch is specified, main is used as default.
* For more information on how to use it, execute it without parameters to see usage information.

## Workflows

Several workflows exist for different purposes:
* **commit**: Run for all commit of a PR to ensure good code quality and working code.
* **scheduled_native_development_delivery**: Delivers 'integreat' and 'malte' native builds to development (Testflight and Beta channel)
twice a month if no production build is delivered.
* **scheduled_production_delivery**: Delivers 'integreat' and 'malte' builds to production.
* **triggered_production_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers 'integreat' and 'malte' builds for native and web to development or production.

See the table below for a more detailed overview:

|Wrokflow|Checks|E2E tests|integreat build|malte build|Version bump|
|---|---|---|---|---|---|
|commit|:heavy_check_mark:|:heavy_check_mark:|:x:|:x:|:x:|
|scheduled_native_production_delivery|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:
|scheduled_production_delivery|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:
|triggered_production_delivery|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:

Steps executed if *Checks* is checked :heavy_check_mark::
* Linting
* Flow type checking
* Unit testing with jest
* Building the app

Steps executed if *Version bump* is checked :heavy_check_mark::
* Jira releases
* Move release notes
* Bump version: Bump the version(s) and create a tag and release on github

## Services

### deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up ["Protected branches"](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

### deliverino (Slack)

The Slack bot `deliverino` is responsible to notify Slack channels about releases. It posts a message for iOS and Android individually as soon as the delivery step has finished.

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

The [bi_weekly_development_delivery workflow](#workflows) makes the builds directly available to TestFlights "App Store Connect Users". Those should not be confused with "External Tests" which require an approval by apple. Therefore, we currently only use "App Store Connect Users" as testers.

In order to add someone as "App Store Connect User" you have to add the Apple Account to App Store Connect and to TestFlight. This is a two-step process.

#### Metadata

The CI/CD pipeline uploads and overwrites metadata during the delivery step.
You can read more about managing metadata for iOS [here](https://docs.fastlane.tools/actions/deliver/).

#### Authenticating

Authentication happens by setting the `FASTLANE_USER` and `FASTLANE_PASSWORD` environment variables as documented [above](#ios-variables). For more information visit the documentation [here](https://docs.fastlane.tools/best-practices/continuous-integration/#environment-variables-to-set) and read about [2-step-verification here](https://github.com/fastlane/fastlane/blob/ee904cd332ab38ca7c1979f0ab58f9389a51fb2d/spaceship/README.md#2-step-verification).


### BrowserStack

We are using BrowserStack to run our E2E tests on real iOS and Android devices.
The general documentation about E2E tests and BrowserStack can be found [here](./native/docs/e2e-testing.md). 


## Determining the Next Version

The next version of the app must be determined programmatically. The tool [next-version](../../tools/next-version) can be used.
More information on the version naming schema used can be found [here](docs/conventions.md#versioning).

## Hints and Quirks

### CPU count aka. $TOTAL_CPUS

There is no obvious way for an application to know how many cores it has available in a CircleCI docker container. The usual ways of getting the CPU count reports the CPU count of the host. This causes out-of-memory issues as the host has a lot of cores.
Therefore, all tools must set the worker limit to `$TOTAL_CPUS`. Set this variable in the `.circleci/config.yml`.
