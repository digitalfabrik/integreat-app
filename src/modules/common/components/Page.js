// @flow

import * as React from 'react'
import { Dimensions, Linking, Text } from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import { OFFLINE_CACHE_PATH, URL_PREFIX } from '../../platform/constants/webview'
import type {
  WebViewNavigation
} from 'react-native-webview/js/WebViewTypes'
import { type NavigationScreenProp, withNavigation } from 'react-navigation'
import renderHtml from '../renderHtml'
import Caption from './Caption'

const WEBVIEW_MARGIN = 8

const WebContainer = styled(AutoHeightWebView)`
  margin: ${WEBVIEW_MARGIN}px;
  width: ${Dimensions.get('window').width - 2 * WEBVIEW_MARGIN}
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
    return (
      <>
        <Caption title={title} />
        {children}
          <WebContainer
            source={{
              baseUrl: URL_PREFIX + OFFLINE_CACHE_PATH,
              html: renderHtml(content, files)
            }}
            allowFileAccess // Needed by android to access file:// urls
            originWhitelist={['*']} // Needed by iOS to load the initial html
            // useWebKit
            scalesPageToFit={false}
            javaScriptEnabled

            dataDetectorTypes={'all'}
            domStorageEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}

            renderError={this.renderError}

            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          />
      </>
    )
  }
}

export default withNavigation(Page)
