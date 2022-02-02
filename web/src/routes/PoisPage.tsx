import { BBox } from 'geojson'
import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WebMercatorViewport } from 'react-map-gl'
import { useNavigate, useParams } from 'react-router-dom'
import { BottomSheetRef } from 'react-spring-bottom-sheet'
import styled from 'styled-components'

import {
  createPOIsEndpoint,
  defaultViewportConfig,
  embedInCollection,
  locationName,
  MapViewViewport,
  NotFoundError,
  pathnameFromRouteInformation,
  PoiFeature,
  PoiModel,
  POIS_ROUTE,
  prepareFeatureLocations,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import PoiPlaceholder from '../assets/POIPlaceholder500x500.jpg'
import BottomActionSheet from '../components/BottomActionSheet'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import MapView from '../components/MapView'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import PoiListItem from '../components/PoiListItem'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { useUserLocation } from '../hooks/useUserLocation'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { log } from '../utils/sentry'

const ListWrapper = styled.div`
  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
  }
`

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewViewport): MapViewViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]]
  ])
}

const PoisPage = ({ cityCode, languageCode, cityModel, pathname, languages }: CityRouteProps): ReactElement => {
  const { poiId } = useParams()
  const { t } = useTranslation('pois')
  const formatter = useContext(DateFormatterContext)
  const { viewportSmall } = useWindowDimensions()
  const navigate = useNavigate()
  const userLocation = useUserLocation()
  const sheetRef = useRef<BottomSheetRef>(null)

  const requestPois = useCallback(
    async () => createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: pois, loading, error: poisError } = useLoadFromEndpoint(requestPois)

  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(null)
  const [featureLocations, setFeatureLocations] = useState<PoiFeature[] | null>(null)

  useEffect(() => {
    if (pois) {
      setFeatureLocations(prepareFeatureLocations(pois, userLocation))
    }
  }, [pois, userLocation])

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const poi = poiId && pois?.find((poi: PoiModel) => poi.path === pathname)

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={false} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = poi
      ? poi.availableLanguages.get(code) || null
      : pathnameFromRouteInformation({ route: POIS_ROUTE, cityCode, languageCode: code })

    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: poi ? { path: poi.path } : null,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    toolbar
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!pois || (poiId && !poi)) {
    const error =
      poisError ||
      new NotFoundError({
        type: 'poi',
        id: pathname,
        city: cityCode,
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  if (poi) {
    const { thumbnail, lastUpdate, content, title, location, featureLocation, urlSlug } = poi
    const pageTitle = `${title} - ${cityModel.name}`

    const mapUrlParams = new URLSearchParams({ [locationName]: urlSlug })
    const mapLink = `${pathnameFromRouteInformation({ route: POIS_ROUTE, cityCode, languageCode })}?${mapUrlParams}`

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
        <Page
          defaultThumbnailSrc={thumbnail || PoiPlaceholder}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          formatter={formatter}
          onInternalLinkClick={navigate}>
          {location.location && (
            <PageDetail
              identifier={t('location')}
              information={location.location}
              link={featureLocation ? mapLink : undefined}
              linkLabel={t('map')}
            />
          )}
        </Page>
      </LocationLayout>
    )
  }
  const sortedPois = featureLocations?.sort((poi1: PoiFeature, poi2: PoiFeature) =>
    poi1.properties.title.localeCompare(poi2.properties.title)
  )
  const renderPoiListItem = (poi: PoiFeature) => <PoiListItem key={poi.properties.path} properties={poi.properties} />
  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      {cityModel.boundingBox && (
        <MapView
          featureCollection={featureLocations && embedInCollection(featureLocations)}
          bboxViewport={moveViewToBBox(cityModel.boundingBox, defaultViewportConfig)}
          ref={sheetRef}
          currentFeature={currentFeature}
          setCurrentFeature={setCurrentFeature}
        />
      )}
      <BottomActionSheet title={currentFeature ? '' : t('sheetTitle')} ref={sheetRef}>
        {currentFeature ? (
          <div>{currentFeature.properties.title}</div>
        ) : (
          sortedPois && (
            <ListWrapper>
              <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} borderless />
            </ListWrapper>
          )
        )}
      </BottomActionSheet>
    </LocationLayout>
  )
}

export default PoisPage
