import React, { ReactElement, useEffect, useState } from 'react'
import PdfRendererView from 'react-native-pdf-renderer'
import styled from 'styled-components/native'

import { PdfViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import Layout from '../components/Layout'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useNavigate from '../hooks/useNavigate'
import useResourceCache from '../hooks/useResourceCache'
import useSnackbar from '../hooks/useSnackbar'
import { getLocalFilePath } from '../utils/helpers'
import openExternalUrl from '../utils/openExternalUrl'

const StyledPdfRendererView = styled(PdfRendererView)`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PDFViewModalProps = {
  route: RouteProps<PdfViewModalRouteType>
  navigation: NavigationProps<PdfViewModalRouteType>
}

const PDFViewModal = ({ route, navigation: _navigation }: PDFViewModalProps): ReactElement => {
  const [error, setError] = useState(false)
  const { url } = route.params
  const { data: resourceCache, refresh, loading } = useResourceCache()
  const showSnackbar = useSnackbar()
  const navigation = useNavigate().navigation
  const filePath = resourceCache[url]

  useEffect(() => {
    if (!loading && !filePath) {
      openExternalUrl(url, showSnackbar)
        .catch(() => setError(true))
        .finally(() => navigation.goBack())
    }
  }, [loading, filePath, url, navigation, showSnackbar])

  if (loading) {
    return <Layout />
  }

  if (!filePath || error) {
    return (
      <Layout>
        <Failure
          code={ErrorCode.UnknownError}
          buttonAction={() => {
            refresh()
            setError(false)
          }}
        />
      </Layout>
    )
  }

  return (
    <Layout>
      <StyledPdfRendererView source={getLocalFilePath(filePath)} onError={() => setError(true)} />
    </Layout>
  )
}
export default PDFViewModal
