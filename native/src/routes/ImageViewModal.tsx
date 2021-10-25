import * as React from 'react'
import { ReactElement, useContext, useState } from 'react'
import { View, Text } from 'react-native'
import { ThemeContext } from 'styled-components'

import { ImageViewModalRouteType } from 'api-client'

import PinchableBox from '../components/PinchableBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'

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
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundAccentColor
      }}>
      <PinchableBox uri='https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Emperor-call_hg.jpg/180px-Emperor-call_hg.jpg' />
    </View>
  )
}

export default ImageViewModal
