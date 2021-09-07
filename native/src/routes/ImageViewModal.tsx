import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { ImageViewer } from 'react-native-image-zoom-viewer'
import { ThemeContext } from 'styled-components'

import { ImageViewModalRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'

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
