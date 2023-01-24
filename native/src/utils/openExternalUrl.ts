import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import buildConfig from '../constants/buildConfig'
import sendTrackingSignal from './sendTrackingSignal'
import { reportError } from './sentry'

const openExternalUrl = async (url: string, showSnackbar: (snackbar: SnackbarType) => void): Promise<void> => {
  const { protocol } = new URL(url)

  try {
    // Custom tabs are not available in all browsers and support only http and https
    if ((await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)) {
      sendTrackingSignal({
        signal: {
          name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
          url,
        },
      })
      InAppBrowser.close()
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor,
      })
    } else {
      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        sendTrackingSignal({
          signal: {
            name: OPEN_OS_LINK_SIGNAL_NAME,
            url,
          },
        })
        await Linking.openURL(url)
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
