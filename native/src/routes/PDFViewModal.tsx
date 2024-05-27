import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import { useTheme } from 'styled-components/native'

import { PdfViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import LoadingSpinner from '../components/LoadingSpinner'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

type PDFViewModalProps = {
  route: RouteProps<PdfViewModalRouteType>
  navigation: NavigationProps<PdfViewModalRouteType>
}

const PDFViewModal = ({ route, navigation: _navigation }: PDFViewModalProps): ReactElement => {
  const [error, setError] = useState<boolean>(false)
  const showSnackbar = useSnackbar()
  const { url } = route.params
  const theme = useTheme()

  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Pdf
        singlePage={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.backgroundAccentColor,
        }}
        renderActivityIndicator={() => <LoadingSpinner />}
        source={{
          uri: url,
        }}
        trustAllCerts={false}
        onError={() => setError(true)}
        onPressLink={url => openExternalUrl(url, showSnackbar)}
      />
    </View>
  )
}
export default PDFViewModal
