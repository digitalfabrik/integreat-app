import md5 from 'md5'
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
import { reportError } from '../utils/sentry'

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

  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (url.startsWith('file://') || url.startsWith('/')) {
          setLocalPath(url)
          setLoading(false)
          return
        }

        const hashedUrl = md5(url).toString()
        const fileName = `${hashedUrl}.pdf`
        const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`
        const fileUri = `file://${filePath}`

        const exists = await ReactNativeBlobUtil.fs.exists(filePath)
        if (exists) {
          setLocalPath(fileUri)
          setLoading(false)
          return
        }

        await ReactNativeBlobUtil.config({
          path: filePath,
        }).fetch('GET', url)

        setLocalPath(fileUri)
        setLoading(false)
      } catch (err) {
        reportError(`Error handling PDF: ${err}`)
        setError(true)
        setLoading(false)
      }
    }

    loadPdf()
  }, [url])

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
