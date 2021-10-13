import * as React from 'react'
import { ReactElement, useState } from 'react'
import { View, Image, Text } from 'react-native'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import { ThemeType } from 'build-configs'
import { ImageViewModalRouteType } from 'api-client'
import PinchableBox from '../components/PinchableBox'

type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
  navigation: NavigationPropType<ImageViewModalRouteType>
}
const ImageViewModal = ({ route }: PropsType): ReactElement => {
  const [isError, setError] = useState(false)
  const theme = useContext(ThemeContext)

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

export default ImageViewModal
