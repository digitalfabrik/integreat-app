// @flow

import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import type { NavigationScreenProp } from 'react-navigation'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  url: string
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
                     backgroundColor='white'
                     saveToLocalByLongPress={false}
                     imageUrls={[{ url: this.props.navigation.getParam('url') }]} />
      </View>
    )
  }
}
