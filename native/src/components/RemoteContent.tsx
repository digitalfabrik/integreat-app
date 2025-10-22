import WebView, { WebViewMessageEvent, WebViewNavigation } from '@dr.pogodin/react-native-webview'
import { mapValues } from 'lodash'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Platform, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { CONSENT_ROUTE } from 'shared'
import { ErrorCode } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { userAgent } from '../constants/endpoint'
import {
  ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE,
  HEIGHT_MESSAGE_TYPE,
  OPEN_SETTINGS_MESSAGE_TYPE,
  WARNING_MESSAGE_TYPE,
} from '../constants/webview'
import { useAppContext } from '../hooks/useCityAppContext'
import useNavigate from '../hooks/useNavigate'
import useResourceCache from '../hooks/useResourceCache'
import { getStaticServerFileUrl } from '../utils/helpers'
import renderHtml from '../utils/renderHtml'
import { log, reportError } from '../utils/sentry'
import Failure from './Failure'
import { StaticServerContext } from './StaticServerProvider'

// Fixes crashing in Android
// https://github.com/react-native-webview/react-native-webview/issues/811
const DEFAULT_OPACITY = 0.99

// Fix title being displayed only after content is visible
const LOADING_OPACITY = 0

export const renderWebviewError = (
  errorDomain: string | null | undefined,
  errorCode: number,
  errorDesc: string,
): React.ReactElement => (
  <Text>
    ${errorDomain} ${errorCode} ${errorDesc}
  </Text>
)

type RemoteContentProps = {
  content: string
  language: string
  onLinkPress: (url: string) => void
  onLoad: () => void
  loading: boolean
}

// If the app crashes without an error message while using RemoteContent, consider wrapping it in a ScrollView or setting a manual height
const RemoteContent = ({
  onLoad,
  content,
  language,
  onLinkPress,
  loading,
}: RemoteContentProps): ReactElement | null => {
  const [error, setError] = useState<string | null>(null)
  const [pressedUrl, setPressedUrl] = useState<string | null>(null)
  const resourceCache = useResourceCache()
  const staticServerUrl = useContext(StaticServerContext)
  const { settings, updateSettings } = useAppContext()
  const { navigateTo } = useNavigate()
  const { externalSourcePermissions } = settings

  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const [webViewHeight, setWebViewHeight] = useState<number>(defaultWebviewHeight)
  const theme = useTheme()
  const { t } = useTranslation()
  const { width: deviceWidth } = useWindowDimensions()

  const resourceMap = mapValues(resourceCache, filePath => getStaticServerFileUrl(filePath, staticServerUrl))

  useEffect(() => {
    // If it takes too long returning false in onShouldStartLoadWithRequest the webview loads the pressed url anyway on android.
    // Therefore only set it to state and execute onLinkPress in useEffect.
    if (pressedUrl) {
      onLinkPress(pressedUrl)
      setPressedUrl(null)
    }
  }, [onLinkPress, pressedUrl])

  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight || content.length === 0) {
      onLoad()
    }
  }, [onLoad, webViewHeight, content])

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
        reportError(error)
        setError(error.message)
      }
    },
    [externalSourcePermissions, navigateTo, updateSettings],
  )

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      if (buildConfig().supportedIframeSources.some(source => event.url.includes(source))) {
        return true
      }
      if (event.url === new URL(staticServerUrl).href) {
        // Needed on iOS for the initial load
        return true
      }
      // block non click events on ios that come up with iframes to avoid opening the iframe source directly in browser
      if (event.navigationType !== 'click' && Platform.OS === 'ios') {
        return false
      }
      // If it takes too long returning false the webview loads the pressed url anyway on android.
      // Therefore only set it to state and execute onLinkPress in useEffect.
      setPressedUrl(event.url)
      return false
    },
    [staticServerUrl],
  )

  if (content.length === 0) {
    return null
  }
  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <WebView
      source={{
        baseUrl: staticServerUrl,
        html: renderHtml(
          content,
          resourceMap,
          buildConfig().supportedIframeSources,
          theme,
          language,
          externalSourcePermissions,
          t,
          deviceWidth,
          dimensions.pageContainerPaddingHorizontal,
        ),
      }}
      originWhitelist={['*']} // Needed by iOS to load the initial html
      javaScriptEnabled
      dataDetectorTypes={['none']}
      userAgent={userAgent}
      domStorageEnabled={false}
      allowsFullscreenVideo
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // To disable scrolling in iOS
      onMessage={onMessage}
      renderError={renderWebviewError}
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

export default RemoteContent
