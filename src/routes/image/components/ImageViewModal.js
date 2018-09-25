// @flow

import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'

export default class ImageViewModal extends React.Component {
  renderNothing (): React.ReactElement<any> {
    return null
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <ImageViewer renderIndicator={this.renderNothing} imageUrls={[{url: this.props.navigation.getParam('url')}]} />
      </View>
    )
  }
}
