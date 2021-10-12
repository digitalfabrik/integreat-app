import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'

import { ErrorCode } from 'api-client'
import { ThemeType } from 'build-configs'

import { userAgent } from '../constants/endpoint'
import { reportError } from '../utils/helpers'
import renderHtml from '../utils/renderHtml'
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
  theme: ThemeType
  cacheDirectory: ParsedCacheDictionaryType
  language: string
  resourceCacheUrl: string
  onLinkPress: (arg0: string) => void
  onLoad: (arg0: void) => void
}

const RemoteContent = (props: PropType): ReactElement | null => {
  const { onLoad, content, cacheDirectory, theme, resourceCacheUrl, language, onLinkPress } = props
  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const { width: webViewWidth } = useWindowDimensions()
  const [webViewHeight, setWebViewHeight] = useState<number>(defaultWebviewHeight)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight) {
      onLoad()
    }
  }, [onLoad, webViewHeight])

  // messages are triggered in renderHtml.ts
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === 'height' && typeof message.height === 'number') {
      setWebViewHeight(message.height)
      return
    }

    const error = new Error(message)
    reportError(error)

    if (message.type === 'error') {
      console.error(message.message)
      setError(message.message)
    } else if (message.type === 'warn') {
      console.warn(message.message)
    }
  }, [])

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      // Needed on iOS for the initial load
      if (event.url === new URL(resourceCacheUrl).href) {
        return true
      }

      onLinkPress(event.url)
      return false
    },
    [resourceCacheUrl, onLinkPress]
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
      style={{
        height: webViewHeight,
        width: webViewWidth
      }}
    />
  )
}

export default RemoteContent
