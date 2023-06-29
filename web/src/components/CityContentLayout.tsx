import React, { ReactElement, ReactNode, useState } from 'react'

import { CityModel, SEARCH_ROUTE } from 'api-client'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import CityContentFooter from './CityContentFooter'
import CityContentHeader from './CityContentHeader'
import FeedbackModal from './FeedbackModal'
import Layout from './Layout'

export type ToolbarProps = (openFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode

type CityContentLayoutProps = {
  toolbar?: ToolbarProps
  children?: ReactNode
  route: RouteType
  feedbackTargetInformation: { slug?: string } | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  city: CityModel
  languageCode: string
  fullWidth?: boolean
  disableScrollingSafari?: boolean
  showFooter?: boolean
}

const CityContentLayout = (props: CityContentLayoutProps): ReactElement => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false)
  const { viewportSmall } = useWindowDimensions()

  const onCloseFeedbackModal = () => {
    setOpenFeedbackModal(false)
  }

  const {
    children,
    languageCode,
    languageChangePaths,
    isLoading,
    route,
    toolbar: toolbarProp,
    fullWidth = false,
    disableScrollingSafari = false,
    showFooter = true,
  } = props
  const { feedbackTargetInformation, city } = props

  const feedbackModal =
    route !== SEARCH_ROUTE && openFeedbackModal ? (
      <FeedbackModal
        cityCode={city.code}
        language={languageCode}
        routeType={route}
        visible={openFeedbackModal}
        closeModal={onCloseFeedbackModal}
        {...feedbackTargetInformation}
      />
    ) : null

  // to avoid jumping issues for desktop, isLoading is only checked on mobile viewport
  const isLoadingMobile = isLoading && viewportSmall
  const toolbar = toolbarProp && !isLoadingMobile ? toolbarProp(setOpenFeedbackModal) : null

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
      modal={feedbackModal}
      toolbar={toolbar}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
