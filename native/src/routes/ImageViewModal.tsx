import * as React from 'react'
import { ReactElement, useState } from 'react'
import { View, Image, Text } from 'react-native'

import { ImageViewModalRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import PinchableBox from '../components/PinchableBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'

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
      <PinchableBox />
    </View>
  )
}

export default withTheme(ImageViewModal)
