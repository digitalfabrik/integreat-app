import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { CHAT_QUERY_KEY } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import useChat from '../hooks/useChat'
import useDimensions from '../hooks/useDimensions'
import useQueryParam from '../hooks/useQueryParam'
import BottomNavigation from './BottomNavigation'
import ChatContainer from './ChatContainer'
import FeedbackContainer from './FeedbackContainer'
import Footer from './Footer'
import { LanguageChangePath } from './LanguageSelection'
import Layout from './Layout'
import RegionContentHeader from './RegionContentHeader'
import ToolsFab from './ToolsFab'
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
      <ToolsFab
        chatEnabled={region.chatEnabled}
        bescheidCheckEnabled={region.bescheidCheckEnabled}
        unreadMessageCount={chat.unreadMessageCount}
      />
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

  const { chatEnabled, bescheidCheckEnabled } = region
  const [chatOpen] = useQueryParam(CHAT_QUERY_KEY)
  const footerVisible = !isLoading && desktop && !fitScreen
  const toolsVisible = (chatEnabled || bescheidCheckEnabled) && layoutReady
  // A direct link such as ?chat=true already opens Frag Integreat. Keep the tour mounted for a later visit.
  const tourVisible = category?.isRoot() && layoutReady && !(chatEnabled && chatOpen)

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
          {toolsVisible && (
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
