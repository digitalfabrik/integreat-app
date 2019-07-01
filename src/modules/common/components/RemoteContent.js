// @flow

import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import { getResourceCacheFilesDirPath, URL_PREFIX } from '../../platform/constants/webview'
import renderHtml from '../renderHtml'
import { type DataDetectorTypes, WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { FileCacheStateType } from '../../app/StateType'
import type { WebViewNavigation } from 'react-native-webview/js/WebViewTypes'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'

// see https://github.com/react-native-community/react-native-webview#common-issues
const StyledView = styled.View`
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
  files: FileCacheStateType,
  cityCode: string,
  onLinkPress: string => void,
  onLoad: void => void
|}

class RemoteContent extends React.Component<PropType, StateType> {
  state = {webViewHeight: 0, webViewWidth: 0}

  onLayout = (event: ViewLayoutEvent) => {
    const {width} = event.nativeEvent.layout
    this.setState({webViewWidth: width})
  }

  onMessage = (event: WebViewMessageEvent) => {
    if (!event.nativeEvent) {
      return
    }
    const height = parseFloat(event.nativeEvent.data)
    this.setState({
      webViewHeight: height
    }, this.props.onLoad)
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
    const {content, files, theme, cityCode} = this.props
    const height = this.state.webViewHeight
    const width = this.state.webViewWidth
    const dataDetectorTypes: DataDetectorTypes = 'all'
    return <StyledView onLayout={this.onLayout}>
      {// $FlowFixMe dataDetectorTypes (correct types, but Flow doesn't try the right branch)
        <WebView
          source={{
            baseUrl: URL_PREFIX + getResourceCacheFilesDirPath(cityCode),
            html: renderHtml(content, files, theme)
          }}
          allowFileAccess // Needed by android to access file:// urls
          originWhitelist={['*']} // Needed by iOS to load the initial html
          useWebKit={false}
          javaScriptEnabled

          dataDetectorTypes={dataDetectorTypes}
          domStorageEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}

          onMessage={this.onMessage}
          style={{height: height, width: width}}
          renderError={this.renderError}
          bounces={false}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />}
    </StyledView>
  }
}

export default RemoteContent
