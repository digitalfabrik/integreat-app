import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import buildConfig from '../constants/buildConfig'
import sendTrackingSignal from './sendTrackingSignal'
import { reportError } from './sentry'

const openExternalUrl = async (url: string, showSnackbar: (snackbar: SnackbarType) => void): Promise<void> => {
  const encodedUrl = encodeURI(url)
  const { protocol } = new URL(encodedUrl)

  try {
    // Custom tabs are not available in all browsers and support only http and https
    if ((await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)) {
      sendTrackingSignal({
        signal: {
          name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
          url: encodedUrl,
        },
      })
      InAppBrowser.close()
      await InAppBrowser.open(encodedUrl, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor,
      })
    } else {
      const canOpen = await Linking.canOpenURL(encodedUrl)

      if (canOpen) {
        sendTrackingSignal({
          signal: {
            name: OPEN_OS_LINK_SIGNAL_NAME,
            url: encodedUrl,
          },
        })
        await Linking.openURL(encodedUrl)
      } else {
        showSnackbar({ text: 'noSuitableAppInstalled' })
      }
    }
  } catch (error) {
    reportError(error)
    showSnackbar({ text: 'unknownError' })
  }
}

export default openExternalUrl
