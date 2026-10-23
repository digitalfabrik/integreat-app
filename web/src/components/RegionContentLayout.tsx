import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { CategoryModel, RegionModel } from 'shared/api'

import useChat from '../hooks/useChat'
import useDimensions from '../hooks/useDimensions'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import ChatFab from './ChatFab'
import FeedbackContainer from './FeedbackContainer'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageSelection'
import Layout from './Layout'
import RegionContentHeader from './RegionContentHeader'
import TourContainer from './TourContainer'

type ToolsContainerProps = {
  region: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
}

const ToolsContainer = ({ region, languageCode, languageChangePaths }: ToolsContainerProps): ReactElement => {
  const chat = useChat({ region, languageCode })

  return (
    <>
      <ChatFab unreadMessageCount={chat.unreadMessageCount} />
      {region.chatEnabled && (
        <ChatContainer
          region={region}
          languageCode={languageCode}
          languageChangePaths={languageChangePaths}
          chatProps={chat}
        />
      )}
    </>
  )
}

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
  const { desktop, mobile } = useDimensions()

  const footerVisible = !isLoading && desktop && !fitScreen
  const chatVisible = region.chatEnabled && layoutReady
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
            <ToolsContainer region={region} languageCode={languageCode} languageChangePaths={languageChangePaths} />
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
