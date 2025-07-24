import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { POIS_ROUTE } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import ChatContainer from './ChatContainer'
import CityContentFooter from './CityContentFooter'
import CityContentHeader from './CityContentHeader'
import Layout from './Layout'

export type CityContentLayoutProps = {
  Toolbar?: ReactElement | null
  children?: ReactNode
  route: RouteType
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  isLoading: boolean
  city: CityModel
  languageCode: string
  fullWidth?: boolean
  disableScrollingSafari?: boolean
  showFooter?: boolean
}

const CityContentLayout = ({
  children,
  city,
  languageCode,
  languageChangePaths,
  isLoading,
  route,
  Toolbar,
  fullWidth = false,
  disableScrollingSafari = false,
  showFooter = true,
}: CityContentLayoutProps): ReactElement => {
  const [layoutReady, setLayoutReady] = useState(!isLoading)
  const { viewportSmall } = useWindowDimensions()
  const isChatEnabled = buildConfig().featureFlags.chat && route !== POIS_ROUTE && city.chatEnabled

  const Footer = viewportSmall ? Toolbar : showFooter && <CityContentFooter city={city.code} language={languageCode} />

  // Avoid flickering due to content (chat) being pushed up by the footer
  useEffect(() => {
    setLayoutReady(!isLoading)
  }, [isLoading])

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
      footer={!isLoading && Footer}
      chat={isChatEnabled && layoutReady ? <ChatContainer city={city} language={languageCode} /> : undefined}
      toolbar={viewportSmall ? null : Toolbar}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
