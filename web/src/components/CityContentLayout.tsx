import React, { ReactElement, ReactNode } from 'react'

import { CityModel } from 'api-client'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import CityContentFooter from './CityContentFooter'
import CityContentHeader from './CityContentHeader'
import Layout from './Layout'

export type CityContentLayoutProps = {
  Toolbar?: ReactNode
  children?: ReactNode
  route: RouteType
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  city: CityModel
  languageCode: string
  fullWidth?: boolean
  disableScrollingSafari?: boolean
  showFooter?: boolean
}

const CityContentLayout = (props: CityContentLayoutProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()

  const {
    children,
    languageCode,
    languageChangePaths,
    isLoading,
    route,
    Toolbar,
    fullWidth = false,
    disableScrollingSafari = false,
    showFooter = true,
    city,
  } = props

  // to avoid jumping issues for desktop, isLoading is only checked on mobile viewport
  const isLoadingMobile = isLoading && viewportSmall

  return (
    <Layout
      disableScrollingSafari={disableScrollingSafari}
      fullWidth={fullWidth}
      header={
        <CityContentHeader
          cityModel={city}
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          route={route}
        />
      }
      footer={
        !isLoading && showFooter && !viewportSmall ? (
          <CityContentFooter city={city.code} language={languageCode} />
        ) : null
      }
      toolbar={!isLoadingMobile && Toolbar}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
