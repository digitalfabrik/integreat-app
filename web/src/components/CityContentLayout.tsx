import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { POIS_ROUTE } from 'shared'
import { CategoryModel, CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useCityContentParams from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import CityContentHeader from './CityContentHeader'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageList'
import Layout from './Layout'

export type CityContentLayoutProps = {
  Toolbar?: ReactElement | null
  children?: ReactNode
  languageChangePaths: LanguageChangePath[] | null
  isLoading: boolean
  city: CityModel
  languageCode: string
  fitScreen?: boolean
  category?: CategoryModel
  pageTitle: string | null
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
  pageTitle,
}: CityContentLayoutProps): ReactElement => {
  const { route } = useCityContentParams()
  const [layoutReady, setLayoutReady] = useState(!isLoading)
  const { desktop, mobile } = useDimensions()
  const isChatEnabled = buildConfig().featureFlags.chat && route !== POIS_ROUTE && city.chatEnabled
  const footerVisible = !isLoading && desktop && !fitScreen
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
          pageTitle={pageTitle}
          fitScreen={fitScreen}
        />
      }
      footer={
        <>
          {footerVisible && <Footer />}
          {chatVisible && <ChatContainer city={city} language={languageCode} />}
          {mobile && <BottomNavigation cityModel={city} languageCode={languageCode} />}
        </>
      }
      toolbar={desktop ? Toolbar : null}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
