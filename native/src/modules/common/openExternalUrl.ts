// @flow

import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import buildConfig from '../app/constants/buildConfig'
import URL from 'url-parse'
import sendTrackingSignal from '../endpoint/sendTrackingSignal'
import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

const openExternalUrl = async (url: string) => {
  const protocol = new URL(url).protocol
  try {
    // Custom tabs are not available in all browsers and support only http and https
    if ((await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)) {
      sendTrackingSignal({ signal: { name: OPEN_EXTERNAL_LINK_SIGNAL_NAME, url } })
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor
      })
    } else {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        sendTrackingSignal({ signal: { name: OPEN_OS_LINK_SIGNAL_NAME, url } })
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
