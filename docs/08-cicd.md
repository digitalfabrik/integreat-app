# Continuous Integration and Delivery

# Worker limits aka. $TOTAL_CPUS

# Pipeline Steps

# Branches vs Pull Requests vs Scheduled


# Environment variables and dependencies

`DELIVERINO_PRIVATE_KEY` (\n in CircleCI)

`FASTLANE_USER`

`FASTLANE_PASSWORD`

# Manual deployment

## Setup environment variables locally

# Credentials and services

## deliverino

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot updates the repository when a new release is delivered.

Access to the Bot is granted by a Private Key in PEM format. This is used to get an access token for an installation. This access_token allows to write content to the repositories/organisations where it was installed.

// PEM is base64 encoded


## Google Play Store

### Adding users to 'beta' channel

### Metadata

bundle exec fastlane supply

## App Store Connect

### TestFlight: Adding users to 'beta' channel

Add to "App Store Connect Users"

### Metadata

bundle exec fastlane deliver

### Authenticating via spaceauth
https://docs.fastlane.tools/best-practices/continuous-integration/#environment-variables-to-set
https://github.com/fastlane/fastlane/tree/master/spaceship#2-step-verification

## BrowserStack



## Slack Bot "deliverino"
