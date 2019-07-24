// @flow

import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'

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
      <View style={{ flex: 1 }}>
        <ImageViewer style={{ flex: 1 }}
                     renderIndicator={this.renderNothing}
                     backgroundColor={'white'}
                     saveToLocalByLongPress={false}
                     imageUrls={[{ url: this.props.navigation.getParam('url') }]} />
      </View>
    )
  }
}
