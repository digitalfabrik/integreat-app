// @flow

import React from 'react'
import { Dimensions, Linking, WebView } from 'react-native'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

const WebContainer = styled.View`
  flex: 1;
  height: ${props => Dimensions.get('screen').height - 60}
`
type PropType = {
  title: string,
  content: string,
  theme: ThemeType
}

class Page extends React.Component<PropType> {
  onLinkPress = (event: *, url: string) => {
    Linking.openURL(url)
  }

  render () {
    return (
      <>
        <WebContainer theme={this.props.theme} >
          <WebView
            source={{html: this.props.content}}
            originWhitelist={['*']}
          />
        </WebContainer>
      </>
    )
  }
}

export default Page
