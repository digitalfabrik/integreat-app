import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import { useTheme } from 'styled-components'

import { ErrorCode, PdfViewModalRouteType } from 'api-client'

import Failure from '../components/Failure'
import LoadingSpinner from '../components/LoadingSpinner'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'

type PropsType = {
  route: RoutePropType<PdfViewModalRouteType>
  navigation: NavigationPropType<PdfViewModalRouteType>
}

const PDFViewModal = ({ route, navigation: _navigation }: PropsType): ReactElement => {
  const [error, setError] = useState<boolean>(false)
  const { url } = route.params
  const theme = useTheme()

  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <View
      style={{
        flex: 1
      }}>
      <Pdf
        singlePage={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.backgroundAccentColor
        }}
        renderActivityIndicator={() => <LoadingSpinner />}
        source={{
          uri: url
        }}
        onError={() => setError(true)}
      />
    </View>
  )
}

export default PDFViewModal
