import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { POIS_ROUTE } from 'shared'
import { CategoryModel, CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useRegionContentParams from '../hooks/useRegionContentParams'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageList'
import Layout from './Layout'
import RegionContentHeader from './RegionContentHeader'

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

const RegionContentLayout = ({
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
  const { route } = useRegionContentParams()
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
        <RegionContentHeader
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
          {chatVisible && (
            <ChatContainer city={city} languageCode={languageCode} languageChangePaths={languageChangePaths} />
          )}
          {mobile && <BottomNavigation cityModel={city} languageCode={languageCode} />}
        </>
      }
      toolbar={desktop ? Toolbar : null}>
      {children}
    </Layout>
  )
}

export default RegionContentLayout
