import RNWebView, { WebViewMessageEvent, WebViewNavigation } from '@dr.pogodin/react-native-webview'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { CONSENT_ROUTE } from 'shared'
import { ErrorCode } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { userAgent } from '../constants/endpoint'
import {
  ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE,
  HEIGHT_MESSAGE_TYPE,
  OPEN_SETTINGS_MESSAGE_TYPE,
  WARNING_MESSAGE_TYPE,
} from '../constants/webview'
import useNavigate from '../hooks/useNavigate'
import useNavigateToLink from '../hooks/useNavigateToLink'
import { useAppContext } from '../hooks/useRegionAppContext'
import { log, captureError } from '../utils/sentry'
import Failure from './Failure'

// Fixes crashing in Android
// https://github.com/react-native-webview/react-native-webview/issues/811
const DEFAULT_OPACITY = 0.99

// Fix title being displayed only after content is visible
const LOADING_OPACITY = 0

// https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
const DEFAULT_WEBVIEW_HEIGHT = 1

const DATA_DETECTOR_TYPES = ['none'] as const
const ORIGIN_WHITELIST = ['*'] as const

type WebViewProps = {
  source: { baseUrl: string; html: string; uri?: undefined } | { uri: string; baseUrl?: undefined }
  domStorageEnabled: boolean
  onLoad?: () => void
  loading?: boolean
}

// If the app crashes without an error message while using WebView, consider wrapping it in a ScrollView or setting a manual height
const WebView = ({ source, domStorageEnabled, onLoad, loading }: WebViewProps): ReactElement | null => {
  const [error, setError] = useState<string | null>(null)
  const [pressedUrl, setPressedUrl] = useState<string | null>(null)
  const { settings, updateSettings } = useAppContext()
  const { navigateTo } = useNavigate()
  const { externalSourcePermissions } = settings
  const navigateToLink = useNavigateToLink()

  const webviewUrl = source.uri ?? source.baseUrl

  const [webViewHeight, setWebViewHeight] = useState<number>(DEFAULT_WEBVIEW_HEIGHT)

  useEffect(() => {
    // If it takes too long returning false in onShouldStartLoadWithRequest the webview loads the pressed url anyway on android.
    // Therefore, only set it to state and execute onLinkPress in useEffect.
    if (pressedUrl) {
      navigateToLink(pressedUrl)
      setPressedUrl(null)
    }
  }, [navigateToLink, pressedUrl])

  useEffect(() => {
    if (webViewHeight !== DEFAULT_WEBVIEW_HEIGHT) {
      onLoad?.()
    }
  }, [onLoad, webViewHeight])

  // messages are triggered in renderHtml.ts
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = JSON.parse(event.nativeEvent.data)
      if (message.type === HEIGHT_MESSAGE_TYPE && typeof message.height === 'number') {
        setWebViewHeight(message.height)
        return
      }

      if (message.type === OPEN_SETTINGS_MESSAGE_TYPE) {
        navigateTo({ route: CONSENT_ROUTE })
        return
      }

      if (message.type === ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE && typeof message.source === 'string') {
        const source = message.source
        const updatedSources = { ...externalSourcePermissions, [source]: true }
        updateSettings({ externalSourcePermissions: updatedSources })
        return
      }

      if (message.type === WARNING_MESSAGE_TYPE) {
        log(message.message, { level: 'warning' })
      } else {
        const messageText: string | undefined = message.message
        const error = new Error(messageText ? JSON.stringify(messageText) : 'Unknown message received from webview')
        captureError(error)
        setError(error.message)
      }
    },
    [externalSourcePermissions, navigateTo, updateSettings],
  )

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      if (buildConfig().supportedIframeSources.some(source => event.url.includes(source) === true)) {
        return true
      }
      if (event.url === new URL(webviewUrl).href) {
        // Needed on iOS for the initial load
        return true
      }
      // block non click events on ios that come up with iframes to avoid opening the iframe source directly in browser
      if (event.navigationType !== 'click' && Platform.OS === 'ios') {
        return false
      }
      // If it takes too long returning false the webview loads the pressed url anyway on android.
      // Therefore, only set it to state and execute onLinkPress in useEffect.
      setPressedUrl(event.url)
      return false
    },
    [webviewUrl],
  )

  if (error) {
    return <Failure code={ErrorCode.UnknownError} retry={null} />
  }

  return (
    <RNWebView
      source={source}
      // Needed by iOS to load the initial html
      originWhitelist={ORIGIN_WHITELIST}
      javaScriptEnabled
      dataDetectorTypes={DATA_DETECTOR_TYPES}
      userAgent={userAgent}
      domStorageEnabled={domStorageEnabled}
      allowsFullscreenVideo
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      // To disable scrolling in iOS
      scrollEnabled={false}
      onMessage={onMessage}
      renderError={<Failure code={ErrorCode.UnknownError} retry={null} />}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      // To allow custom handling of link clicks in android
      // https://github.com/react-native-webview/react-native-webview/issues/1869
      setSupportMultipleWindows={false}
      style={{
        height: webViewHeight,
        opacity: loading ? LOADING_OPACITY : DEFAULT_OPACITY,
      }}
    />
  )
}

export default WebView
