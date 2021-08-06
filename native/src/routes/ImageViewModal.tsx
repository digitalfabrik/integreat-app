import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { ImageViewModalRouteType } from 'api-client'
import React, { ReactElement, useContext } from 'react'
import { ThemeContext } from 'styled-components'

export const SUPPORTED_IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png']

type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
  navigation: NavigationPropType<ImageViewModalRouteType>
}

const ImageViewModal = ({ route }: PropsType): ReactElement => {
  const theme = useContext(ThemeContext)

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
        backgroundColor={theme.colors.backgroundAccentColor}
        saveToLocalByLongPress={false}
        imageUrls={[
          {
            url: route.params.url
          }
        ]}
      />
    </View>
  )
}

export default ImageViewModal
