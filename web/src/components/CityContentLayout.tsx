import React, { ReactElement, ReactNode, useState } from 'react'

import { CityModel, SEARCH_ROUTE } from 'api-client'

import { RouteType } from '../routes'
import CityContentFooter from './CityContentFooter'
import CityContentHeader from './CityContentHeader'
import FeedbackModal from './FeedbackModal'
import Layout from './Layout'

export type ToolbarProps = (openFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode

type CityContentLayoutProps = {
  toolbar?: ToolbarProps
  viewportSmall: boolean
  children?: ReactNode
  route: RouteType
  feedbackTargetInformation: { slug?: string } | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  cityModel: CityModel
  languageCode: string
  fullWidth?: boolean
  disableScrollingSafari?: boolean
  showFooter?: boolean
}

const CityContentLayout = (props: CityContentLayoutProps): ReactElement => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false)

  const {
    viewportSmall,
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
  const { feedbackTargetInformation, cityModel } = props

  const feedbackModal =
    route !== SEARCH_ROUTE && openFeedbackModal ? (
      <FeedbackModal
        cityCode={cityModel.code}
        language={languageCode}
        routeType={route}
        visible={openFeedbackModal}
        closeModal={() => setOpenFeedbackModal(false)}
        {...feedbackTargetInformation}
      />
    ) : null

  const toolbar = toolbarProp && !isLoading ? toolbarProp(setOpenFeedbackModal) : null

  return (
    <Layout
      disableScrollingSafari={disableScrollingSafari}
      fullWidth={fullWidth}
      header={
        <CityContentHeader
          cityModel={cityModel}
          languageChangePaths={languageChangePaths}
          viewportSmall={viewportSmall}
          languageCode={languageCode}
          route={route}
        />
      }
      footer={
        !isLoading && showFooter && !viewportSmall ? (
          <CityContentFooter city={cityModel.code} language={languageCode} />
        ) : null
      }
      modal={feedbackModal}
      toolbar={toolbar}>
      {children}
    </Layout>
  )
}

export default CityContentLayout
