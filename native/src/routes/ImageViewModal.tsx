import * as React from 'react'
import { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { ThemeContext } from 'styled-components'

import { ImageViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import PinchPanImage from '../components/PinchPanImage'
import { RouteProps } from '../constants/NavigationTypes'

type ImageViewModalProps = {
  route: RouteProps<ImageViewModalRouteType>
}

const ImageViewModal = ({ route }: ImageViewModalProps): ReactElement => {
  const [isError, setError] = useState(false)
  const theme = useContext(ThemeContext)

  const {
    colors: { backgroundAccentColor },
  } = theme

  if (isError) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: backgroundAccentColor,
      }}>
      <PinchPanImage uri={route.params.url} onError={() => setError(true)} />
    </View>
  )
}

export default ImageViewModal
