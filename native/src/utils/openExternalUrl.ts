import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { SnackbarError } from '../hooks/useSnackbar'
import sendTrackingSignal from './sendTrackingSignal'

const openExternalUrl = async (url: string): Promise<void> => {
  const { protocol } = new URL(url)

  try {
    // Custom tabs are not available in all browsers and support only http and https
    if ((await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)) {
      sendTrackingSignal({
        signal: {
          name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
          url
        }
      })
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().lightTheme.colors.themeColor
      })
    } else {
      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        sendTrackingSignal({
          signal: {
            name: OPEN_OS_LINK_SIGNAL_NAME,
            url
          }
        })
        await Linking.openURL(url)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new SnackbarError('This is not a supported route. Skipping.')
      }
    }
  } catch (error) {
    console.error(error)
    if (error instanceof SnackbarError) {
      throw error
    }
  }
}

export default openExternalUrl
