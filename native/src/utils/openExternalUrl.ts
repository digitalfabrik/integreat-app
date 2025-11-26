import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import buildConfig from '../constants/buildConfig'
import sendTrackingSignal from './sendTrackingSignal'
import { reportError } from './sentry'

const WAIT_UNTIL_IN_APP_BROWSER_CLOSED = 100
const openExternalUrl = async (rawUrl: string, showSnackbar: (snackbar: SnackbarType) => void): Promise<void> => {
  const encodedUrl = encodeURI(decodeURIComponent(rawUrl))
  const { protocol } = new URL(encodedUrl)
  const internalLinkRegexp = new RegExp(buildConfig().internalUrlPattern)

  const canBeOpenedWithInAppBrowser = (await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)
  const canBeOpenedWithOtherApp = await Linking.canOpenURL(encodedUrl)
  const isInternalLink = internalLinkRegexp.test(encodedUrl)

  try {
    if (canBeOpenedWithInAppBrowser) {
      sendTrackingSignal({
        signal: {
          name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
          url: encodedUrl,
        },
      })
      InAppBrowser.close()
      // On ios InAppBrowser seems to need some time to close the browser until it can be opened again properly
      // https://github.com/digitalfabrik/integreat-app/issues/3084
      await new Promise(resolve => {
        setTimeout(resolve, WAIT_UNTIL_IN_APP_BROWSER_CLOSED)
      })
      // Opening internal links in the InAppBrowser leads to an endless loop as it opens integreat again
      // Workaround by using http:// instead, see #2724
      const url = isInternalLink ? encodedUrl.replace('https://', 'http://') : encodedUrl
      await InAppBrowser.open(url, {
        toolbarColor: buildConfig().legacyLightTheme.colors.themeColor,
      })
    } else if (isInternalLink) {
      // Opening internal links via Linking opens it in integreat again leading to an endless loop, see #2440
      showSnackbar({ text: 'noSuitableAppInstalled' })
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
