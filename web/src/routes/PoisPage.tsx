import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  defaultMercatorViewportConfig,
  LocationType,
  MapViewMercatorViewport,
  MapViewViewport,
  normalizePath,
  NotFoundError,
  pathnameFromRouteInformation,
  POIS_ROUTE,
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackModal from '../components/FeedbackModal'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useFeatureLocations from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import getUserLocation from '../utils/getUserLocation'
import { log } from '../utils/sentry'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewMercatorViewport): MapViewMercatorViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]],
  ])
}

const PoisPage = ({ cityCode, languageCode, city, pathname }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const { slug: unsafeSlug } = useParams()
  const slug = unsafeSlug ? normalizePath(unsafeSlug) : undefined
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<LocationType | undefined>(undefined)
  const { data, error: featureLocationsError, loading } = useFeatureLocations(cityCode, languageCode, userLocation)
  const currentPoi = useMemo(() => data?.pois.find(poi => slug === poi.slug) ?? null, [data?.pois, slug])
  // keep the old mapViewport when changing the viewport
  const [mapViewport, setMapViewport] = useState<MapViewViewport>()
  const { viewportSmall } = useWindowDimensions()
  useEffect(() => {
    getUserLocation().then(userLocation =>
      userLocation.status === 'ready' ? setUserLocation(userLocation.coordinates) : null
    )
  }, [])

  useEffect(
    () => (city ? setMapViewport(moveViewToBBox(city.boundingBox, defaultMercatorViewportConfig)) : undefined),
    [city]
  )

  if (!city) {
    return null
  }

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = currentPoi
      ? currentPoi.availableLanguages.get(code) || null
      : pathnameFromRouteInformation({ route: POIS_ROUTE, cityCode, languageCode: code })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  const toolbar = (
    <CityContentToolbar
      feedbackTarget={currentPoi?.slug}
      route={POIS_ROUTE}
      iconDirection='row'
      hideDivider
      languageCode={languageCode}
      pageTitle={pageTitle}
    />
  )

  const feedbackModal = isFeedbackModalOpen && (
    <FeedbackModal
      cityCode={city.code}
      language={languageCode}
      routeType={POIS_ROUTE}
      closeModal={() => setIsFeedbackModalOpen(false)}
      topPosition={undefined}
    />
  )

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
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

  // To calculate the height of the PoisPage container, we have to reduce 100vh by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.navigationMenuHeight
  const direction = config.getScriptDirection(languageCode)

  const sharedPoiProps = {
    toolbar,
    features: data.features,
    pois: data.pois,
    direction,
    userLocation,
    languageCode,
    slug,
    mapViewport,
    setMapViewport,
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={currentPoi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <PoisMobile {...sharedPoiProps} />
        ) : (
          <PoisDesktop {...sharedPoiProps} panelHeights={panelHeights} cityModel={city} />
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </CityContentLayout>
  )
}

export default PoisPage
