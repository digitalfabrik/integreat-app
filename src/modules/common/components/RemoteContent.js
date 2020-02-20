// @flow

import * as React from 'react'
import { Text } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import { createHtmlSource, getResourceCacheFilesDirPath, URL_PREFIX } from '../../platform/constants/webview'
import renderHtml from '../renderHtml'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { PageResourceCacheStateType } from '../../app/StateType'
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'
import { RTL_LANGUAGES } from '../../i18n/constants'

// see https://github.com/react-native-community/react-native-webview#common-issues
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
  files: PageResourceCacheStateType,
  language: string,
  cityCode: string,
  onLinkPress: string => void,
  onLoad: void => void
|}

class RemoteContent extends React.Component<PropType, StateType> {
  state = { webViewHeight: 0, webViewWidth: 0 }

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
      throw Error(`Got an unknown message from the webview.`)
    }
  }

  onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url
    // Needed on iOS for the initial load
    if (url === URL_PREFIX + getResourceCacheFilesDirPath(this.props.cityCode)) {
      return true
    }

    this.props.onLinkPress(url)
    return false
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  render () {
    const { content, files, theme, cityCode, language } = this.props
    const height = this.state.webViewHeight
    const width = this.state.webViewWidth
    return <StyledView onLayout={this.onLayout}>
      {<WebView
        source={createHtmlSource(renderHtml(content, files, theme, RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'),
          URL_PREFIX + getResourceCacheFilesDirPath(cityCode))}
        allowFileAccessFromFileURLs // Needed by android to access file:// urls
        originWhitelist={['*']} // Needed by iOS to load the initial html
        javaScriptEnabled

        dataDetectorTypes='all'
        domStorageEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}

        onMessage={this.onMessage}
        style={{ height, width }}
        renderError={this.renderError}
        bounces={false}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
      />}
    </StyledView>
  }
}

export default RemoteContent
