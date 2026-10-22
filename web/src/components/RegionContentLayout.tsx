import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { PLACES_ROUTE } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import useRegionContentParams from '../hooks/useRegionContentParams'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import FeedbackContainer from './FeedbackContainer'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageSelection'
import Layout from './Layout'
import RegionContentHeader from './RegionContentHeader'
import TourContainer from './TourContainer'

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
  slug: string | null
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
  const [layoutReady, setLayoutReady] = useState(!isLoading)
  const { route } = useRegionContentParams()
  const { desktop, mobile } = useDimensions()

  const footerVisible = !isLoading && desktop && !fitScreen
  const chatVisible = region.chatEnabled && route !== PLACES_ROUTE && layoutReady
  const tourVisible = category?.isRoot() && layoutReady

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
          {tourVisible && <TourContainer region={region} languageCode={languageCode} />}
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
