// @flow

import React from 'react'
import { ActivityIndicator, Dimensions, Linking, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import RNFetchblob from 'rn-fetch-blob'
import { URL_PREFIX } from '../../platform/constants/webview'
import type { WebViewEvent, WebViewNavigation } from 'react-native-webview/js/WebViewTypes'
import injected from './injected'
import { withNavigation } from 'react-navigation'

const WebContainer = styled.View`
  flex: 1;
  height: ${props => Dimensions.get('screen').height - 60}
`
type PropType = {
  title: string,
  content: string,
  theme: ThemeType,
  files: { [url: string]: string }
}

class Page extends React.Component<PropType> {
  onLinkPress = (event: *, url: string) => {
    Linking.openURL(url)
  }

  onNavigate = (event: WebViewNavigation) => {
    console.debug(event)
  }

  onShouldStartLoadWithRequest = (event: WebViewEvent) => {
    console.debug(event)
    if (event.url.includes('.pdf')) {
      // Linking.openURL(event.url).catch(err => console.error('An error occurred', err))
      this.props.navigation.push('PDF', {file: event.url})
      return false
    }
    if (!event.url.endsWith('/Documents')) {
      return false
    }
    return true
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  renderLoading = () => {
    return <ActivityIndicator size='large' color='#0000ff' />
  }

  renderHtml = () => {
    // language=HTML
    return `
<html>
<body>
${this.props.content}
<script>${injected(this.props.files)}</script>
</body>
</html>
`
  }

  render () {
    return (
      <>
        <WebContainer theme={this.props.theme}>
          <WebView
            source={{
              baseUrl: URL_PREFIX + RNFetchblob.fs.dirs.DocumentDir,
              html: this.renderHtml()
            }}
            allowFileAccess
            originWhitelist={['*']}
            useWebKit={false}
            javaScriptEnabled

            mediaPlaybackRequiresUserAction
            dataDetectorTypes={'all'}

            domStorageEnabled={false}

            onNavigationStateChange={this.onNavigate}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            renderError={this.renderError}
          />
        </WebContainer>
      </>
    )
  }
}

export default withNavigation(Page)
