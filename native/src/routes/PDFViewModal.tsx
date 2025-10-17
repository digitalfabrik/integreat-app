import React, { ReactElement, useState, useEffect } from 'react'
import { View } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
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
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [localPath, setLocalPath] = useState<string>('')
  const { url } = route.params
  const { data: resourceCache } = useResourceCache()

  useEffect(() => {
    const loadPdf = async () => {
      const fileHash = url.substring(url.lastIndexOf('/') + 1).split('.')[0]
      const cachedFile = Object.values(resourceCache).find(resourceEntry => resourceEntry.hash === fileHash)

      const exists = await ReactNativeBlobUtil.fs.exists(cachedFile?.filePath ?? '')
      if (exists) {
        setLocalPath(`file://${cachedFile?.filePath}`)
        setLoading(false)
      }
    }

    loadPdf()
  }, [resourceCache, url])

  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  if (loading || !localPath) {
    return (
      <LoadingSpinnerContainer>
        <LoadingSpinner />
      </LoadingSpinnerContainer>
    )
  }

  return <StyledPdfRendererView source={localPath} distanceBetweenPages={8} onError={() => setError(true)} />
}
export default PDFViewModal
