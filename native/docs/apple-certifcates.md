# Apple Certificates

## How do I setup certificates?

Refer to the [Manual Builds documentation](manual-builds.md#ios) for a guide on how to set up certificates.

## What Types of Certificates Exist?

The certificate system of Apple seems very complex at first. Therefore, we will briefly explain the types of certificates and what the purpose is.

| Certificate Type | Usable for Development | Usable for Testing | Usable for Production |
| ---------------- | ---------------------- | ------------------ | --------------------- |
| Development      | :heavy_check_mark:     | :x:                | :x:                   |
| Ad-hoc           | :x:                    | :heavy_check_mark: | :x:                   |
| Enterprise       | :x:                    | :heavy_check_mark: | :heavy_check_mark:    |
| App Store        | :x:                    | :x:                | :heavy_check_mark:    |

Also, there are various ways to install an iOS app which require different kinds of signing:

- Via a URL which is opened in Safari
- Via App Store
- Via XCode

Development certificates are for developers who want to install the app on their devices. You have to select the devices in the Provisioning Profile at [developer.apple.com](https://developer.apple.com/account/resources/profiles/list) you want to install the app on. This means the Device ID (UDID) has to be whitelisted.

Ad-hoc certificates are for public tests with a small amount of users. The difference is that you can provide the testers a URL which they can open on their device to install it. The Device ID (UDID) still has to be whitelisted.

Enterprise certificates allow you to deliver you app within your company or have a bigger public test. It is not possible for small organisation to acquire such a certificate.

App Store certificates allows the upload of the app into the App Store. It is not possible to install a app store signed app directly on your device. It has to be uploaded to App Store Connect.
