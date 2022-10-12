import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import { useTheme } from 'styled-components'

import { ErrorCode, PdfViewModalRouteType } from 'api-client'

import Failure from '../components/Failure'
import LoadingSpinner from '../components/LoadingSpinner'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

type PDFViewModalProps = {
  route: RoutePropType<PdfViewModalRouteType>
  navigation: NavigationPropType<PdfViewModalRouteType>
}

const PDFViewModal = ({ route, navigation: _navigation }: PDFViewModalProps): ReactElement => {
  const [error, setError] = useState<boolean>(false)
  const { t } = useTranslation('error')
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
        onPressLink={url => openExternalUrl(url).catch(() => showSnackbar(t('unknownError')))}
      />
    </View>
  )
}
export default PDFViewModal
