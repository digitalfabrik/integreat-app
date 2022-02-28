import React, { ReactElement, ReactNode, useState } from 'react'

import { CityModel, POIS_ROUTE, SEARCH_ROUTE } from 'api-client'

import Layout from '../components/Layout'
import LocationFooter from '../components/LocationFooter'
import { RouteType } from '../routes'
import FeedbackModal from './FeedbackModal'
import { FeedbackRatingType } from './FeedbackToolbarItem'
import LocationHeader from './LocationHeader'

export type ToolbarPropType = (openFeedbackModal: (rating: FeedbackRatingType) => void) => ReactNode

type PropsType = {
  toolbar?: ToolbarPropType
  viewportSmall: boolean
  children?: ReactNode
  route: RouteType
  feedbackTargetInformation: { path?: string; alias?: string } | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  cityModel: CityModel
  languageCode: string
}

const LocationLayout = (props: PropsType): ReactElement => {
  const [asideStickyTop, setAsideStickyTop] = useState<number>(0)
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)

  const { viewportSmall, children, languageCode, languageChangePaths, isLoading, route, toolbar: toolbarProp } = props
  const { feedbackTargetInformation, cityModel } = props

  const feedbackModal =
    route !== SEARCH_ROUTE && feedbackModalRating ? (
      <FeedbackModal
        cityCode={cityModel.code}
        language={languageCode}
        routeType={route}
        feedbackRating={feedbackModalRating}
        closeModal={() => setFeedbackModalRating(null)}
        {...feedbackTargetInformation}
      />
    ) : null

  const toolbar = toolbarProp && !isLoading ? toolbarProp(setFeedbackModalRating) : null

  return (
    <Layout
      fullWidth={route === POIS_ROUTE}
      asideStickyTop={asideStickyTop}
      header={
        <LocationHeader
          cityModel={cityModel}
          languageChangePaths={languageChangePaths}
          viewportSmall={viewportSmall}
          onStickyTopChanged={setAsideStickyTop}
          languageCode={languageCode}
          route={route}
        />
      }
      footer={!isLoading ? <LocationFooter city={cityModel.code} language={languageCode} /> : null}
      modal={feedbackModal}
      toolbar={toolbar}>
      {children}
    </Layout>
  )
}

export default LocationLayout
