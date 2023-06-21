import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { normalizePath, NotFoundError, pathnameFromRouteInformation, POIS_ROUTE } from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackModal from '../components/FeedbackModal'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useFeatureLocations from '../hooks/useFeatureLocations'
import usePoiFeatures from '../hooks/usePoiFeatures'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { log } from '../utils/sentry'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const PoisPage = ({ cityCode, languageCode, cityModel, pathname, languages }: CityRouteProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { slug: unsafeSlug } = useParams()
  const slug = unsafeSlug ? normalizePath(unsafeSlug) : undefined
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)

  const { data, error: featureLocationsError, loading } = useFeatureLocations(cityCode, languageCode)
  const { currentPoi, currentFeatureOnMap } = usePoiFeatures(slug, data?.features, data?.pois)
  const { viewportSmall } = useWindowDimensions()

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({
      route: POIS_ROUTE,
      cityCode,
      languageCode: code,
      slug,
    }),
    name,
    code,
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: currentPoi ? { slug: currentPoi.slug } : null,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    disableScrollingSafari: true,
    showFooter: false,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!data) {
    const error =
      featureLocationsError ||
      new NotFoundError({
        type: 'poi',
        id: pathname,
        city: cityCode,
        language: languageCode,
      })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  // To calculate the height of the PoisPage container, we have to reduce 100vh by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.navigationMenuHeight
  const direction = config.getScriptDirection(languageCode)

  const feedbackModal = feedbackModalRating && (
    <FeedbackModal
      cityCode={cityModel.code}
      language={languageCode}
      routeType={POIS_ROUTE}
      feedbackRating={feedbackModalRating}
      closeModal={() => setFeedbackModalRating(null)}
    />
  )

  const toolbar = (
    <CityContentToolbar openFeedbackModal={setFeedbackModalRating} viewportSmall={viewportSmall} iconDirection='row' />
  )

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={currentPoi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={cityModel}
      />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <PoisMobile
            toolbar={toolbar}
            features={data.features}
            currentPoi={currentPoi}
            currentFeatureOnMap={currentFeatureOnMap}
            direction={direction}
            cityModel={cityModel}
            languageCode={languageCode}
          />
        ) : (
          <PoisDesktop
            toolbar={toolbar}
            panelHeights={panelHeights}
            direction={direction}
            cityModel={cityModel}
            currentFeatureOnMap={currentFeatureOnMap}
            currentPoi={currentPoi}
            features={data.features}
            languageCode={languageCode}
          />
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </CityContentLayout>
  )
}

export default PoisPage
