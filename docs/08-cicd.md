# Continuous Integration and Delivery

# Worker limits aka. $TOTAL_CPUS

# Pipeline Steps


# Environment variables and dependencies

`DELIVERINO_PRIVATE_KEY` (\n in CircleCI)

`FASTLANE_USER`

`FASTLANE_PASSWORD`

# Credentials and services

## deliverino

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bots updates the repository when a new release is delivered.

Access to the Bot is granted by a Private Key in PEM format. This is used to get an access token for an installation. This access_token allows to write content to the repositories/organisations where it was installed.

// PEM is base64 encoded


## Google Play Store

### Metadata

bundle exec fastlane supply

## App Store Connect

### Metadata

bundle exec fastlane deliver

### Authenticating via spaceauth
https://docs.fastlane.tools/best-practices/continuous-integration/#environment-variables-to-set
https://github.com/fastlane/fastlane/tree/master/spaceship#2-step-verification

## BrowserStack


## TestFlight

### App Store Connect Users
