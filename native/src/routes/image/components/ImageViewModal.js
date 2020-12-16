// @flow

import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import type {
  ImageViewModalRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'

type PropsType = {|
  route: RoutePropType<ImageViewModalRouteType>,
  navigation: NavigationPropType<ImageViewModalRouteType>
|}

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
                     imageUrls={[{ url: this.props.route.params.url }]} />
      </View>
    )
  }
}
