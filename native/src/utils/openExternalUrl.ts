import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import buildConfig from '../constants/buildConfig'
import sendTrackingSignal from './sendTrackingSignal'
import { reportError } from './sentry'

const openExternalUrl = async (rawUrl: string, showSnackbar: (snackbar: SnackbarType) => void): Promise<void> => {
  const encodedUrl = encodeURI(rawUrl)
  const { protocol } = new URL(encodedUrl)

  const noInAppBrowserAvailableAndIntegreatLink =
    !(await InAppBrowser.isAvailable()) && encodedUrl.includes(buildConfig().hostName)
  const canBeOpenedWithInAppBrowser = (await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)
  const canBeOpenedWithOtherApp = await Linking.canOpenURL(encodedUrl)

  try {
    if (noInAppBrowserAvailableAndIntegreatLink) {
      showSnackbar({ text: 'noSuitableAppInstalled' })
    } else if (canBeOpenedWithInAppBrowser) {
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
    } else if (canBeOpenedWithOtherApp) {
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
  } catch (error) {
    reportError(error)
    showSnackbar({ text: 'unknownError' })
  }
}

export default openExternalUrl
