import * as React from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import { ThemeType } from 'build-configs'
import { ImageViewModalRouteType } from 'api-client'
type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
  navigation: NavigationPropType<ImageViewModalRouteType>
  theme: ThemeType
}

class ImageViewModal extends React.Component<PropsType> {
  render() {
    return (
      <View
        style={{
          flex: 1
        }}>
        <ImageViewer
          style={{
            flex: 1
          }}
          renderIndicator={() => <></>}
          backgroundColor={this.props.theme.colors.backgroundAccentColor}
          saveToLocalByLongPress={false}
          imageUrls={[
            {
              url: this.props.route.params.url
            }
          ]}
        />
      </View>
    )
  }
}

export default withTheme(ImageViewModal)
