// @flow

import React from 'react'
import { Dimensions, Linking } from 'react-native'
import { WebView } from 'react-native-webview'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import injected from './injected.js'
import RNFetchblob from 'rn-fetch-blob'
import { URL_PREFIX } from '../../platform/constants/webview'

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

  render () {
    return (
      <>
        <WebContainer theme={this.props.theme}>
          <WebView
            source={{
              baseUrl: URL_PREFIX + RNFetchblob.fs.dirs.DocumentDir,
              html: `<html><body style="display:none">${this.props.content}</body></html>`
            }}
            allowFileAccess
            injectedJavaScript={injected(this.props.files)}
            originWhitelist={['*']}
            useWebKit={false}
          />
        </WebContainer>
      </>
    )
  }
}

export default Page
