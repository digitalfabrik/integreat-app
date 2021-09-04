import * as React from 'react'
import { ReactElement, useState } from 'react'
import { View, Image, Text } from 'react-native'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import { ThemeType } from 'build-configs'
import { ImageViewModalRouteType } from 'api-client'

type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
  navigation: NavigationPropType<ImageViewModalRouteType>
  theme: ThemeType
}
const ImageViewModal = (props: PropsType): ReactElement => {
  const [isError, setError] = useState(false)

  if (isError) {
    return <Text>Error</Text>
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.theme.colors.backgroundAccentColor
      }}>
      <Image
        style={{ flex: 1 }}
        resizeMode='center'
        source={{ uri: props.route.params.url }}
        onError={() => {
          setError(true)
        }}
      />
    </View>
  )
}

export default withTheme(ImageViewModal)
