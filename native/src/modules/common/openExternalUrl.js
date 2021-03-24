// @flow

import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import buildConfig from '../app/constants/buildConfig'
import URL from 'url-parse'

const openExternalUrl = async (url: string) => {
  const protocol = new URL(url).protocol
  try {
    // Custom tabs are not available in all browsers and support only http and https
    if ((await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)) {
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor
      })
    } else {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
      } else {
        console.warn('This is not a supported route. Skipping.')
        // TODO IGAPP-521 show snackbar route not found
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default openExternalUrl
