import { TFunction } from 'i18next'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import URL from 'url-parse'

import { SnackbarType } from '../components/SnackbarContainer'
import buildConfig from '../constants/buildConfig'
import useSnackbar from '../hooks/useSnackbar'
import { captureError } from './sentry'

const WAIT_UNTIL_IN_APP_BROWSER_CLOSED = 100

type OpenExternalUrlProps = {
  showSnackbar: (snackbar: SnackbarType) => void
  t: TFunction<['error']>
}

export const openExternalUrl = async (rawUrl: string, { showSnackbar, t }: OpenExternalUrlProps): Promise<void> => {
  const encodedUrl = encodeURI(decodeURIComponent(rawUrl))
  const { protocol } = new URL(encodedUrl)
  const internalLinkRegexp = new RegExp(buildConfig().internalUrlPattern)

  const canBeOpenedWithInAppBrowser = (await InAppBrowser.isAvailable()) && ['https:', 'http:'].includes(protocol)
  // Linking is undefined in some test environments, but the type definitions say it's always an object.
  // We cast it to satisfy the linter while keeping the runtime check.
  const linking = Linking as typeof Linking | undefined | null
  const canBeOpenedWithOtherApp =
    linking != null && typeof linking.canOpenURL === 'function' ? await linking.canOpenURL(encodedUrl) : false
  const isInternalLink = internalLinkRegexp.test(encodedUrl)

  try {
    if (canBeOpenedWithInAppBrowser) {
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
        toolbarColor: buildConfig().lightTheme.palette.secondary.main,
      })
    } else if (isInternalLink) {
      // Opening internal links via Linking opens it in integreat again leading to an endless loop, see #2440
      showSnackbar({ text: t($ => $.error.noSuitableAppInstalled) })
    } else if (canBeOpenedWithOtherApp) {
      await Linking.openURL(encodedUrl)
    } else {
      showSnackbar({ text: t($ => $.error.noSuitableAppInstalled) })
    }
  } catch (error) {
    captureError(error)
    showSnackbar({ text: t($ => $.error.unknownError) })
  }
}

const useOpenExternalUrl = (): ((rawUrl: string) => void) => {
  const { t } = useTranslation(['error'])
  const showSnackbar = useSnackbar()

  return useCallback(
    (rawUrl: string) => openExternalUrl(rawUrl, { showSnackbar, t }).catch(captureError),
    [showSnackbar, t],
  )
}

export default useOpenExternalUrl
