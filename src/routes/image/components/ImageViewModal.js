// @flow

import * as React from 'react'
import styled from 'styled-components'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'

// adding a negative margin to also show the image beneath the header
const ImageViewContainer = styled.View`
flex: 1;
margin-top: ${props => -props.theme.dimensions.modalHeaderHeight};
`

type PropsType = {
  navigation: NavigationScreenProp<*>,
  url: string,
  theme: ThemeType
}

export default class ImageViewModal extends React.Component<PropsType> {
  renderNothing (): React.Node {
    return null
  }

  render () {
    return (
      <ImageViewContainer>
        <ImageViewer style={{flex: 1}}
                     renderIndicator={this.renderNothing}
                     backgroundColor={'white'}
                     saveToLocalByLongPress={false}
                     imageUrls={[{url: this.props.navigation.getParam('url')}]} />
      </ImageViewContainer>
    )
  }
}
