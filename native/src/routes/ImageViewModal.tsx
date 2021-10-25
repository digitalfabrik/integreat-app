import * as React from 'react'
import { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text } from 'react-native'
import { ThemeContext } from 'styled-components'

import { ImageViewModalRouteType } from 'api-client'

import PinchableBox from '../components/PinchableBox'
import { RoutePropType } from '../constants/NavigationTypes'

type PropsType = {
  route: RoutePropType<ImageViewModalRouteType>
}

const ImageViewModal = ({ route }: PropsType): ReactElement => {
  const [isError, setError] = useState(false)
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('dashboard')

  if (isError) {
    return <Text>{t('imageLoadingFailed')}</Text>
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundAccentColor
      }}>
      <PinchableBox
        uri={route.params.url}
        onError={_ => {
          setError(true)
        }}
      />
    </View>
  )
}

export default ImageViewModal
