import * as React from 'react'
import { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { ThemeContext } from 'styled-components'

import { ErrorCode, ImageViewModalRouteType } from 'api-client'

import Failure from '../components/Failure'
import PinchPanImage from '../components/PinchPanImage'
import { RoutePropType } from '../constants/NavigationTypes'

type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
}

const ImageViewModal = ({ route }: PropsType): ReactElement => {
  const [isError, setError] = useState(false)
  const theme = useContext(ThemeContext)

  if (isError) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundAccentColor
      }}>
      <PinchPanImage uri={route.params.url} onError={() => setError(true)} />
    </View>
  )
}

export default ImageViewModal
