import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { PLACES_ROUTE } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useRegionContentParams from '../hooks/useRegionContentParams'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import FeedbackContainer from './FeedbackContainer'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageList'
import Layout from './Layout'
import RegionContentHeader from './RegionContentHeader'

export type RegionContentLayoutProps = {
  toolbar?: ReactElement | null
  children?: ReactNode
  languageChangePaths: LanguageChangePath[] | null
  isLoading: boolean
  region: RegionModel
  languageCode: string
  fitScreen?: boolean
  category?: CategoryModel
  pageTitle: string | null
  slug?: string
}

const RegionContentLayout = ({
  children,
  category,
  region,
  languageCode,
  languageChangePaths,
  isLoading,
  toolbar,
  fitScreen = false,
  pageTitle,
  slug,
}: RegionContentLayoutProps): ReactElement => {
  const { route } = useRegionContentParams()
  const [layoutReady, setLayoutReady] = useState(!isLoading)
  const { desktop, mobile } = useDimensions()
  const isChatEnabled = buildConfig().featureFlags.chat && route !== PLACES_ROUTE && region.chatEnabled
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
          regionModel={region}
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
            <ChatContainer region={region} languageCode={languageCode} languageChangePaths={languageChangePaths} />
          )}
          <FeedbackContainer slug={slug} />
          {mobile && <BottomNavigation regionModel={region} languageCode={languageCode} />}
        </>
      }
      toolbar={desktop ? toolbar : null}>
      {children}
    </Layout>
  )
}

export default RegionContentLayout
