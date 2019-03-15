// @flow

import * as React from 'react'
import { Dimensions, Linking, Text } from 'react-native'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import { OFFLINE_CACHE_PATH, URL_PREFIX } from '../../platform/constants/webview'
import type {
  WebViewNavigation
} from 'react-native-webview/js/WebViewTypes'
import { type NavigationScreenProp, withNavigation } from 'react-navigation'
import renderHtml from '../renderHtml'
import Caption from './Caption'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

const WEBVIEW_MARGIN = 8

const StyledView = styled.View`
  overflow: hidden;
`

const WebContainer = styled(WebView)`
  margin: 0 ${WEBVIEW_MARGIN}px;
  width: ${Dimensions.get('window').width - 2 * WEBVIEW_MARGIN}px;
  height: 300;
`
type PropType = {
  title: string,
  content: string,
  theme: ThemeType,
  navigation: NavigationScreenProp<*>,
  files: { [url: string]: string },
  children?: React.Node
}

class Page extends React.Component<PropType> {
  state: {
    webViewHeight: number
  }

  constructor (props: PropType) {
    super(props)
    this.state = {
      webViewHeight: 0
    }
    this.onMessage = this.onMessage.bind(this)
  }

  onMessage (event: WebViewMessageEvent) {
    if (!event.nativeEvent) {
      return
    }
    const height = parseInt(event.nativeEvent.data)
    this.setState({
      webViewHeight: height
    })
  }

  onLinkPress = (url: string) => {
    if (url.includes('.pdf')) {
      this.props.navigation.navigate('PDFViewModal', {url})
    } else if (url.includes('.png') || url.includes('.jpg')) {
      this.props.navigation.navigate('ImageViewModal', {url})
    } else {
      Linking.openURL(url).catch(err => console.error('An error occurred', err))
    }
  }

  onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url
    // Needed on iOS for the initial load
    if (url === URL_PREFIX + OFFLINE_CACHE_PATH) {
      return true
    }

    this.onLinkPress(url)

    return false
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  render () {
    const {title, children, content, files} = this.props
    const height = this.state.webViewHeight
    return (
      <>
        <Caption title={title} />
        {children}
        <StyledView>
          <WebContainer
            source={{
              baseUrl: URL_PREFIX + OFFLINE_CACHE_PATH,
              html: renderHtml(content, files)
            }}
            allowFileAccess // Needed by android to access file:// urls
            originWhitelist={['*']} // Needed by iOS to load the initial html
            useWebKit
            scalesPageToFit={false}
            javaScriptEnabled

            dataDetectorTypes={'all'}
            domStorageEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}

            onMessage={this.onMessage}
            style={{height: height}}

            renderError={this.renderError}

            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          />
        </StyledView>
      </>
    )
  }
}

export default withNavigation(Page)
