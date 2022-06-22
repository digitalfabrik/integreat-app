import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import { Map } from 'maplibre-gl'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LngLatLike } from 'react-map-gl'
import { useSearchParams } from 'react-router-dom'
import { BottomSheetRef } from 'react-spring-bottom-sheet'
import styled from 'styled-components'

import {
  defaultMercatorViewportConfig,
  detailZoom,
  embedInCollection,
  locationName,
  MapViewMercatorViewport,
  NotFoundError,
  pathnameFromRouteInformation,
  PoiFeature,
  POIS_ROUTE
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackModal from '../components/FeedbackModal'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import MapView from '../components/MapView'
import PoiListItem from '../components/PoiListItem'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useFeatureLocations from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import { log } from '../utils/sentry'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewMercatorViewport): MapViewMercatorViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]]
  ])
}

const PoisPage = ({ cityCode, languageCode, cityModel, pathname, languages }: CityRouteProps): ReactElement => {
  const [queryParams, setQueryParams] = useSearchParams()
  const { data, error: featureLocationsError, loading } = useFeatureLocations(cityCode, languageCode)
  const [mapRef, setMapRef] = useState<Map | null>(null)
  const selectedFeatureSlug = queryParams.get(locationName)
  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(
    data?.features.find(it => it.properties.urlSlug === selectedFeatureSlug) ?? null
  )
  const poi = data?.pois.find(it => it.urlSlug === selectedFeatureSlug)
  const { viewportSmall } = useWindowDimensions()
  const sheetRef = useRef<BottomSheetRef>(null)
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)
  const { t } = useTranslation('pois')

  const selectFeature = (feature: PoiFeature | null) => {
    if (mapRef?.isMoving()) {
      mapRef.stop()
    }
    if (feature) {
      queryParams.set(locationName, feature.properties.urlSlug)
    } else {
      queryParams.delete(locationName)
    }
    setQueryParams(queryParams)
  }

  const updateMapRef = useCallback(node => {
    // This allows us to use the map (ref) as dependency in hooks which is not possible using useRef.
    // This is needed because on initial render the ref is null such that flyTo is not possible.
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    if (node) {
      setMapRef(node.getMap())
    }
  }, [])

  useEffect(() => {
    const currentFeature =
      data?.features.find((feature: PoiFeature) => feature.properties.urlSlug === selectedFeatureSlug) ?? null
    setCurrentFeature(currentFeature)

    const coordinates = currentFeature?.geometry.coordinates ?? []

    if (mapRef && coordinates[0] && coordinates[1]) {
      const coords: LngLatLike = [coordinates[0], coordinates[1]]
      mapRef.flyTo({ center: coords, zoom: detailZoom })
    }
  }, [mapRef, data, selectedFeatureSlug])

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

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

  const nextFeatureIndex = (step: 1 | -1, arrayLength: number, currentIndex: number): number => {
    if (currentIndex === arrayLength - 1 && step > 0) {
      return 0
    }
    if (currentIndex === 0 && step < 0) {
      return arrayLength - 1
    }
    return currentIndex + step
  }

  const changeSnapPoint = (snapPoint: number) => {
    if (viewportSmall) {
      sheetRef.current?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
    }
  }

  const toolbar = (
    <LocationToolbar openFeedbackModal={setFeedbackModalRating} viewportSmall={viewportSmall} iconDirection='row' />
  )

  const feedbackModal = feedbackModalRating && (
    <FeedbackModal
      cityCode={cityModel.code}
      language={languageCode}
      routeType={POIS_ROUTE}
      feedbackRating={feedbackModalRating}
      closeModal={() => setFeedbackModalRating(null)}
    />
  )

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: poi ? { path: poi.path } : null,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    disableScrollingSafari: true
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!data) {
    const error =
      featureLocationsError ||
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

  const switchFeature = (step: 1 | -1) => {
    const featureIndex = data.features.findIndex(
      (poi: PoiFeature) => poi.properties.urlSlug === currentFeature?.properties.urlSlug
    )
    const updatedIndex = nextFeatureIndex(step, data.features.length, featureIndex)
    const feature = data.features[updatedIndex]
    selectFeature(feature ?? null)
  }

  const renderPoiListItem = (poi: PoiFeature) => (
    <PoiListItem key={poi.properties.path} poi={poi} selectFeature={selectFeature} />
  )
  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`
  const direction = config.getScriptDirection(languageCode)

  const mapView = cityModel.boundingBox && (
    <MapView
      ref={updateMapRef}
      selectFeature={selectFeature}
      changeSnapPoint={changeSnapPoint}
      featureCollection={embedInCollection(data.features)}
      bboxViewport={moveViewToBBox(cityModel.boundingBox, defaultMercatorViewportConfig)}
      currentFeature={currentFeature}
      direction={direction}
    />
  )

  const poiList = <List noItemsMessage={t('noPois')} items={data.features} renderItem={renderPoiListItem} borderless />
  // To calculate the height of the PoisPage container, we have to reduce 100vh by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.footerHeight + dimensions.navigationMenuHeight

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <PoisMobile
            currentFeature={currentFeature}
            toolbar={toolbar}
            ref={sheetRef}
            poi={poi}
            mapView={mapView}
            poiList={poiList}
            selectFeature={selectFeature}
            direction={direction}
          />
        ) : (
          <PoisDesktop
            switchFeature={switchFeature}
            poi={poi}
            currentFeature={currentFeature}
            toolbar={toolbar}
            panelHeights={panelHeights}
            mapView={mapView}
            poiList={poiList}
            selectFeature={selectFeature}
            direction={direction}
          />
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </LocationLayout>
  )
}

export default PoisPage
