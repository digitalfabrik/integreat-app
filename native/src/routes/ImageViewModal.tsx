import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ImageViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import PinchPanImage from '../components/PinchPanImage'
import { RouteProps } from '../constants/NavigationTypes'
import useResourceCache from '../hooks/useResourceCache'
import { getCachedResource } from '../utils/helpers'

type ImageViewModalProps = {
  route: RouteProps<ImageViewModalRouteType>
}

const ImageViewModal = ({ route }: ImageViewModalProps): ReactElement => {
  const [isError, setError] = useState(false)
  const { url } = route.params
  const theme = useTheme()
  const { data: resourceCache } = useResourceCache()
  const cachedImage = getCachedResource(url, { resourceCache })

  if (isError) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundAccentColor,
      }}>
      <PinchPanImage uri={cachedImage} onError={() => setError(true)} />
    </View>
  )
}

export default ImageViewModal
