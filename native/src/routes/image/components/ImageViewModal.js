// @flow

import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import type {
  ImageViewModalRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from 'build-configs/ThemeType'

type PropsType = {|
  route: RoutePropType<ImageViewModalRouteType>,
  navigation: NavigationPropType<ImageViewModalRouteType>,
  theme: ThemeType
|}

class ImageViewModal extends React.Component<PropsType> {
  renderNothing (): React.Node {
    return null
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <ImageViewer style={{ flex: 1 }}
                     renderIndicator={this.renderNothing}
                     backgroundColor={this.props.theme.colors.backgroundAccentColor}
                     saveToLocalByLongPress={false}
                     imageUrls={[{ url: this.props.route.params.url }]} />
      </View>
    )
  }
}

export default withTheme(ImageViewModal)
