import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import { useTheme } from 'styled-components/native'

import { ErrorCode } from 'api-client'

import dimensions from '../constants/dimensions'
import { userAgent } from '../constants/endpoint'
import { HEIGHT_MESSAGE_TYPE, WARNING_MESSAGE_TYPE } from '../constants/webview'
import renderHtml from '../utils/renderHtml'
import { log, reportError } from '../utils/sentry'
import Failure from './Failure'
import { ParsedCacheDictionaryType } from './Page'

export const renderWebviewError = (
  errorDomain: string | null | undefined,
  errorCode: number,
  errorDesc: string
): React.ReactElement => (
  <Text>
    ${errorDomain} ${errorCode} ${errorDesc}
  </Text>
)

type PropType = {
  content: string
  cacheDirectory: ParsedCacheDictionaryType
  language: string
  resourceCacheUrl: string
  onLinkPress: (url: string) => void
  onLoad: () => void
}

const RemoteContent = (props: PropType): ReactElement | null => {
  const { onLoad, content, cacheDirectory, resourceCacheUrl, language, onLinkPress } = props
  const [error, setError] = useState<string | null>(null)
  const [pressedUrl, setPressedUrl] = useState<string | null>(null)
  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const [webViewHeight, setWebViewHeight] = useState<number>(defaultWebviewHeight)
  const { width } = useWindowDimensions()
  const webViewWidth = width - 2 * dimensions.page.horizontalMargin
  const theme = useTheme()

  useEffect(() => {
    // If it takes too long returning false in onShouldStartLoadWithRequest the webview loads the pressed url anyway.
    // Therefore only set it to state and execute onLinkPress in useEffect.
    const url = pressedUrl
    if (url) {
      setPressedUrl(null)
      onLinkPress(url)
    }
  }, [onLinkPress, pressedUrl])

  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight) {
      onLoad()
    }
  }, [onLoad, webViewHeight])

  // messages are triggered in renderHtml.ts
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === HEIGHT_MESSAGE_TYPE && typeof message.height === 'number') {
      setWebViewHeight(message.height)
      return
    }

    if (message.type === WARNING_MESSAGE_TYPE) {
      log(message.message, 'warning')
    } else {
      const error = new Error(message.message ?? 'Unknown message received from webview')
      reportError(error)
      setError(error.message)
    }
  }, [])

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      // Needed on iOS for the initial load
      if (event.url === new URL(resourceCacheUrl).href) {
        return true
      }
      // If it takes too long returning false the webview loads the pressed url anyway.
      // Therefore only set it to state and execute onLinkPress in useEffect.
      setPressedUrl(event.url)
      return false
    },
    [resourceCacheUrl]
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
        baseUrl: resourceCacheUrl,
        html: renderHtml(content, cacheDirectory, theme, language)
      }}
      originWhitelist={['*']} // Needed by iOS to load the initial html
      javaScriptEnabled
      dataDetectorTypes='none'
      userAgent={userAgent}
      domStorageEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // to disable scrolling in iOS
      onMessage={onMessage}
      renderError={renderWebviewError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      // To allow custom handling of link clicks
      // https://github.com/react-native-webview/react-native-webview/issues/1869
      setSupportMultipleWindows={false}
      style={{
        height: webViewHeight,
        width: webViewWidth
      }}
    />
  )
}

export default RemoteContent
