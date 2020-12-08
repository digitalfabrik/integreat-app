// @flow

import React, { useState, useEffect, type Element } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'
import { createHtmlSource } from '../../platform/constants/webview'
import renderHtml from '../renderHtml'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'
import type { ParsedCacheDictionaryType } from './Page'

const StyledView: StyledComponent<{||}, {||}, *> = styled.View`
  overflow: hidden;
  flex: 1;
`

type PropType = {|
  content: string,
  theme: ThemeType,
  cacheDirectory: ParsedCacheDictionaryType,
  language: string,
  resourceCacheUrl: string,
  onLinkPress: string => void,
  onLoad: void => void
|}

const RemoteContent = (props: PropType) => {
  const [webViewHeight, setWebViewHeight] = useState(0)
  const [webViewWidth, setWebViewWidth] = useState(0)

  useEffect(() => {
    props.onLoad()
  }, [webViewHeight])

  function onLayout (event: ViewLayoutEvent) {
    const { width } = event.nativeEvent.layout
    setWebViewWidth(width)
  }

  function onMessage (event: WebViewMessageEvent) {
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
  }

  function onShouldStartLoadWithRequest (event: WebViewNavigation): boolean {
    // Needed on iOS for the initial load
    if (event.url === new URL(props.resourceCacheUrl).href) {
      return true
    }

    props.onLinkPress(event.url)
    return false
  }

  function renderError (errorDomain: ?string, errorCode: number, errorDesc: string): Element<*> {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  const { content, cacheDirectory, theme, resourceCacheUrl, language } = props
  return <StyledView onLayout={onLayout}>
    <WebView
      source={createHtmlSource(renderHtml(content, cacheDirectory, theme, language), resourceCacheUrl)}
      originWhitelist={['*']} // Needed by iOS to load the initial html
      javaScriptEnabled
      dataDetectorTypes='all'
      domStorageEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // to disable scrolling in iOS

      onMessage={onMessage}
      renderError={renderError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}

      style={{
        height: webViewHeight,
        width: webViewWidth
      }}
    />
  </StyledView>
}

export default RemoteContent
