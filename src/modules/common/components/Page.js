// @flow

import * as React from 'react'
import { Dimensions, Linking, Text } from 'react-native'
import styled, { withTheme } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import { OFFLINE_CACHE_PATH, URL_PREFIX } from '../../platform/constants/webview'
import type { WebViewNavigation } from 'react-native-webview/js/WebViewTypes'
import { type NavigationScreenProp, withNavigation } from 'react-navigation'
import renderHtml from '../renderHtml'
import Caption from './Caption'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import compose from 'lodash/fp/compose'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'

const HORIZONTAL_MARGIN = 8

const StyledView = styled.View`
  overflow: hidden;
`

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px;
  margin-bottom: 8px;
`

type StateType = {
  webViewHeight: number,
  webViewWidth: number,
  loading: boolean
}

type PropType = {
  title: string,
  content: string,
  theme: ThemeType,
  navigation: NavigationScreenProp<*>,
  resourceCache: { [url: string]: string },
  children?: React.Node,
  language: string,
  lastUpdate: Moment
}

class Page extends React.Component<PropType, StateType> {

  constructor (props: PropType) {
    super(props)
    this.state = {
      webViewHeight: 0,
      webViewWidth: 0,
      loading: true
    }
    this.onMessage = this.onMessage.bind(this)
    this.onLayout = this.onLayout.bind(this)
  }

  onLayout () {
    this.setState({
      webViewWidth: Dimensions.get('window').width - 2 * HORIZONTAL_MARGIN
    })
  }

  onMessage (event: WebViewMessageEvent) {
    if (!event.nativeEvent) {
      return
    }
    const height = parseFloat(event.nativeEvent.data)
    this.setState({
      webViewHeight: height,
      loading: false
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
    const {title, children, content, resourceCache, theme, language, lastUpdate} = this.props
    const height = this.state.webViewHeight
    const width = this.state.webViewWidth
    return (
      <Container onLayout={this.onLayout}>
        <Caption title={title} />
        {children}
        <StyledView>
          <WebView
            source={{
              baseUrl: URL_PREFIX + OFFLINE_CACHE_PATH,
              html: renderHtml(content, resourceCache, theme)
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
            style={{height: height, width: width}}

            renderError={this.renderError}

            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          />
        </StyledView>
        {!this.state.loading && <TimeStamp lastUpdate={lastUpdate} language={language} />}
      </Container>
    )
  }
}

export default compose(
  withNavigation,
  withTheme
)(Page)
