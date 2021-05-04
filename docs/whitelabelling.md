# Whitelabeling

The aim of this document is to provide a (preferably) complete overview about the process of creating a new whitelabelled app.

## Contents

- [Necessary information from customer](#from-customer)
- [Necessary information from CMS](#from-cms)
- [AppTeam TODOs](#appteam-todos)

## Necessary Information

A list of necessary information to build and deliver a whitelabelled app.

### From Customer

Information the customer needs to provide for their own whitelabelled app.
Some points may overlap and are therefore duplicated.

#### For build config

Information necessary for the creation of a new build config.

- App name
- Application id / bundle identifier
- App icon
- Header icon
- Theme color
- Activated features
- Splash screen / launch screen (+ background for webapp)
- Imprint text
- About app link
- Privacy policy link
- Languages of the app
- Different translations (especially metadata)
- (De)activated features: pois, news stream, push notifications, offers, ...
- Fonts (Content, UI only at own risk)

#### For Stores/Webapp

Information necessary for the setup of the store and webapp presences.

- Webapp domain (DF or own?)
- Apple app store:
  - DF account or own?
  - App title
  - App icon
  - Description
  - Keywords
  - Screenshots (to be created by us, which screens?)
  - Privacy policy url
  - Support url (maybe use DF?)
  - Marketing url (= information website, maybe use DF?)
  - [optional] Subtitle
  - [optional] App store account (for external access)
- Google play store:
  - DF account or own?
  - App title
  - App icon (512 x 512)
  - Short description
  - Full description
  - Application category (probably always social)
  - Tags
  - Screenshots (to be created by us, which screens?)
  - Feature graphic (image displayed in google play store app on top)
  - Privacy policy url
  - Support email (maybe use DF?)
  - Website (= same as apple marketing url, maybe use DF?)
  - Address (maybe use DF?)
  - [optional] Adaptive app icon
  - [optional] Promo video
  - [optional] Play store account (for external access)

### From CMS

Information needed from our CMS.

- CMS url
- Switch cms url
- Share base url
- Allowed host names
- Internal link hijack pattern
- [depends] City name (to skip the landing screen)

## AppTeam TODOs

Things the AppTeam has to do and therefore probably create issues for.

- Add build config
- Setup app store presence
- Add new App to permissions of GooglePlay CI service account  
- Modify assets: intro slide icons, location marker
- Setup firebase
- Setup certificates
  - Android
  - iOS
- Add sentry flag
- Create screenshots with the following aspect ratios (for iOS):
  - 1242 x 2208
  - 1242 x 2688
  - 2048 x 2732
- Add to google search console
- Translate and add translations
  - New languages
  - Override translations
- CI adjustments for delivery
- Add iTunes app id
- Adjust manifest.json in webapp?
- Other feature requests
