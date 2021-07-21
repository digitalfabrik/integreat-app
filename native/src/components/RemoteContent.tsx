import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { createHtmlSource } from '../constants/webview'
import renderHtml from '../utils/renderHtml'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'
import { ParsedCacheDictionaryType } from './Page'
import { ThemeType } from 'build-configs'

const StyledView = styled.View`
  overflow: hidden;
  flex: 1;
`
export const renderWebviewError = (
  errorDomain: string | null | undefined,
  errorCode: number,
  errorDesc: string
): React.ReactElement => {
  return (
    <Text>
      ${errorDomain} ${errorCode} ${errorDesc}
    </Text>
  )
}

type PropType = {
  content: string
  theme: ThemeType
  cacheDirectory: ParsedCacheDictionaryType
  language: string
  resourceCacheUrl: string
  onLinkPress: (arg0: string) => void
  onLoad: (arg0: void) => void
}

const RemoteContent = (props: PropType): ReactElement => {
  const { onLoad, content, cacheDirectory, theme, resourceCacheUrl, language, onLinkPress } = props
  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const [webViewHeight, setWebViewHeight] = useState(defaultWebviewHeight)
  const [webViewWidth, setWebViewWidth] = useState(defaultWebviewHeight)

  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight) {
      onLoad()
    }
  }, [onLoad, webViewHeight])

  const onLayout = useCallback(
    (event: ViewLayoutEvent) => {
      const { width } = event.nativeEvent.layout
      setWebViewWidth(width)
    },
    [setWebViewWidth]
  )

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      if (!event.nativeEvent) {
        return
      }

      const message = JSON.parse(event.nativeEvent.data)

      if (message.type === 'error') {
        throw Error(`An error occurred in the webview:\n${message.message}`)
      } else if (message.type === 'height' && typeof message.height === 'number') {
        setWebViewHeight(message.height)
      } else {
        throw Error('Got an unknown message from the webview.')
      }
    },
    [setWebViewHeight]
  )

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

  return (
    <StyledView onLayout={onLayout}>
      <WebView
        source={createHtmlSource(renderHtml(content, cacheDirectory, theme, language), resourceCacheUrl)}
        originWhitelist={['*']} // Needed by iOS to load the initial html
        javaScriptEnabled
        dataDetectorTypes='none'
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
    </StyledView>
  )
}

export default RemoteContent
