import React, { ReactElement, useState } from 'react'
import PdfRendererView from 'react-native-pdf-renderer'
import styled from 'styled-components/native'

import { PdfViewModalRouteType } from 'shared'
import { ErrorCode } from 'shared/api'

import Failure from '../components/Failure'
import Layout from '../components/Layout'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useResourceCache from '../hooks/useResourceCache'

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
  const filePath = resourceCache[url]

  if (loading) {
    return <Layout />
  }

  if (!filePath || error) {
    return (
      <Layout>
        <Failure code={ErrorCode.UnknownError} buttonAction={refresh} />
      </Layout>
    )
  }
  const source = `file://${filePath}`
  return (
    <Layout>
      <StyledPdfRendererView source={source} distanceBetweenPages={8} onError={() => setError(true)} />
    </Layout>
  )
}
export default PDFViewModal
