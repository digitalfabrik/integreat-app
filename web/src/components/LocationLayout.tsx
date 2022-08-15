import React, { ReactElement, ReactNode, useState } from 'react'
import { useTheme } from 'styled-components'

import { CityModel, SEARCH_ROUTE } from 'api-client'

import Layout from '../components/Layout'
import LocationFooter from '../components/LocationFooter'
import buildConfig from '../constants/buildConfig'
import useScript from '../hooks/useScript'
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
  fullWidth?: boolean
  disableScrollingSafari?: boolean
  showFooter?: boolean
}

const LocationLayout = (props: PropsType): ReactElement => {
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)
  const theme = useTheme()
  useScript('https://unpkg.com/@rasahq/rasa-chat')

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
      disableScrollingSafari={disableScrollingSafari}
      fullWidth={fullWidth}
      header={
        <LocationHeader
          cityModel={cityModel}
          languageChangePaths={languageChangePaths}
          viewportSmall={viewportSmall}
          languageCode={languageCode}
          route={route}
        />
      }
      footer={!isLoading && showFooter ? <LocationFooter city={cityModel.code} language={languageCode} /> : null}
      modal={feedbackModal}
      toolbar={toolbar}>
      <>
        {children}
        {buildConfig().featureFlags.developerFriendly && cityModel.name === 'München' && (
          <div
            id='rasa-chat-widget'
            data-primary={theme.colors.themeColor}
            data-primary-highlight={theme.colors.themeColor}
            data-websocket-url='https://your-rasa-url-here/'
          />
        )}
      </>
    </Layout>
  )
}

export default LocationLayout
