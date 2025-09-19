import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { POIS_ROUTE } from 'shared'
import { CategoryModel, CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useCityContentParams from '../hooks/useCityContentParams'
import useWindowDimensions from '../hooks/useWindowDimensions'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import CityContentFooter from './CityContentFooter'
import CityContentHeader from './CityContentHeader'
import Layout from './Layout'

export type CityContentLayoutProps = {
  Toolbar?: ReactElement | null
  children?: ReactNode
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  isLoading: boolean
  city: CityModel
  languageCode: string
  fitScreen?: boolean
  category?: CategoryModel
}

const CityContentLayout = ({
  children,
  category,
  city,
  languageCode,
  languageChangePaths,
  isLoading,
  Toolbar,
  fitScreen = false,
}: CityContentLayoutProps): ReactElement => {
  const { route } = useCityContentParams()
  const [layoutReady, setLayoutReady] = useState(!isLoading)
  const { viewportSmall } = useWindowDimensions()
  const isChatEnabled = buildConfig().featureFlags.chat && route !== POIS_ROUTE && city.chatEnabled
  const footerVisible = !isLoading && !viewportSmall && !fitScreen
  const chatVisible = isChatEnabled && layoutReady

  // Avoid flickering due to content (chat) being pushed up by the footer
  useEffect(() => setLayoutReady(!isLoading), [isLoading])

  return (
    <Layout
      fitScreen={fitScreen}
      header={
        <CityContentHeader
          category={category}
          cityModel={city}
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
        />
      }
      footer={
        <>
          {footerVisible && <CityContentFooter city={city.code} language={languageCode} />}
          {chatVisible && <ChatContainer city={city} language={languageCode} />}
          {viewportSmall && <BottomNavigation cityModel={city} languageCode={languageCode} />}
        </>
      }
      toolbar={viewportSmall ? null : Toolbar}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
