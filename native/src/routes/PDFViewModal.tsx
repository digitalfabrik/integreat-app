import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import PdfRendererView from 'react-native-pdf-renderer'
import styled from 'styled-components/native'

import { PdfViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import LoadingSpinner from '../components/LoadingSpinner'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useResourceCache from '../hooks/useResourceCache'

const LoadingSpinnerContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledPdfRendererView = styled(PdfRendererView)`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

type PDFViewModalProps = {
  route: RouteProps<PdfViewModalRouteType>
  navigation: NavigationProps<PdfViewModalRouteType>
}

const PDFViewModal = ({ route, navigation: _navigation }: PDFViewModalProps): ReactElement => {
  const [error, setError] = useState(false)
  const { url } = route.params
  const { data: resourceCache, refresh, loading } = useResourceCache()
  const filePath = resourceCache[url]

  if (loading) {
    return (
      <LoadingSpinnerContainer>
        <LoadingSpinner />
      </LoadingSpinnerContainer>
    )
  }

  if (error || !filePath) {
    return <Failure code={ErrorCode.UnknownError} buttonAction={refresh} />
  }

  const source = `file://${filePath}`
  return <StyledPdfRendererView source={source} distanceBetweenPages={8} onError={() => setError(true)} />
}
export default PDFViewModal
