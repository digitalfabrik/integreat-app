// @flow

import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'
import { createHtmlSource } from '../../platform/constants/webview'
import renderHtml from '../renderHtml'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { PageResourceCacheStateType } from '../../app/StateType'
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'

const StyledView: StyledComponent<{}, {}, *> = styled.View`
  overflow: hidden;
  flex: 1;
`

type StateType = {|
  webViewHeight: number,
  webViewWidth: number
|}

type PropType = {|
  content: string,
  theme: ThemeType,
  cacheDirectory: PageResourceCacheStateType,
  language: string,
  resourceCacheUrl: string,
  onLinkPress: string => void,
  onLoad: void => void
|}

class RemoteContent extends React.Component<PropType, StateType> {
  state = {
    webViewHeight: 0,
    webViewWidth: 0
  }

  onLayout = (event: ViewLayoutEvent) => {
    const { width } = event.nativeEvent.layout
    this.setState({ webViewWidth: width })
  }

  onMessage = (event: WebViewMessageEvent) => {
    if (!event.nativeEvent) {
      return
    }
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === 'error') {
      throw Error(`An error occurred in the webview:\n${message.message}`)
    } else if (message.type === 'height' && typeof message.height === 'number') {
      this.setState({ webViewHeight: message.height }, this.props.onLoad)
    } else {
      throw Error('Got an unknown message from the webview.')
    }
  }

  onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    // Needed on iOS for the initial load
    if (event.url === new URL(this.props.resourceCacheUrl).href) {
      return true
    }

    this.props.onLinkPress(event.url)
    return false
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  render () {
    const { content, cacheDirectory, theme, resourceCacheUrl, language } = this.props
    const height = this.state.webViewHeight
    const width = this.state.webViewWidth
    return <StyledView onLayout={this.onLayout}>
      <WebView
        source={createHtmlSource(renderHtml(content, cacheDirectory, theme, language), resourceCacheUrl)}
        originWhitelist={['*']} // Needed by iOS to load the initial html
        javaScriptEnabled
        dataDetectorTypes='all'
        domStorageEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // to disable scrolling in iOS

        onMessage={this.onMessage}
        style={{
          height,
          width
        }}
        renderError={this.renderError}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
      />
    </StyledView>
  }
}

export default RemoteContent
