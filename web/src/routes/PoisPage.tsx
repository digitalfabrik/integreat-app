import { BBox } from 'geojson'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WebMercatorViewport } from 'react-map-gl'
import { useLocation } from 'react-router-dom'
import { BottomSheetRef } from 'react-spring-bottom-sheet'
import styled from 'styled-components'

import {
  defaultViewportConfig,
  embedInCollection,
  locationName,
  MapViewViewport,
  NotFoundError,
  pathnameFromRouteInformation,
  PoiFeature,
  PoiModel,
  POIS_ROUTE
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'
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
import { useFeatureLocations } from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import { log } from '../utils/sentry'
import updateQueryParams from '../utils/updateQueryParams'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const Icon = styled.img`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;
`

const NavItem = styled.div`
  display: flex;
  cursor: pointer;
`

const Label = styled.span`
  align-self: center;
  font-size: ${props => props.theme.fonts.contentFontSizeSmall};
`

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewViewport): MapViewViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]]
  ])
}

const PoisPage = ({ cityCode, languageCode, cityModel, pathname, languages }: CityRouteProps): ReactElement => {
  const queryParams = new URLSearchParams(useLocation().search)
  const { t } = useTranslation('pois')
  const { featureLocations, pois, poisError, loading } = useFeatureLocations(cityCode, languageCode)
  const { viewportSmall } = useWindowDimensions()
  const sheetRef = useRef<BottomSheetRef>(null)
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)
  const [queryLocation, setQueryLocation] = useState<string | null>(queryParams.get(locationName))

  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(null)

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const poi = currentFeature
    ? pois?.find((poi: PoiModel) => poi.urlSlug === currentFeature.properties.urlSlug)
    : undefined

  const poiIndex = currentFeature
    ? featureLocations.findIndex((poi: PoiFeature) => poi.properties.urlSlug === currentFeature.properties.urlSlug)
    : null

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

  const selectFeature = (feature: PoiFeature | null) => {
    setCurrentFeature(feature)
  }

  const getNewIndex = (step: number, arrayLength: number, currentIndex: number): number => {
    if (currentIndex === arrayLength - 1 && step > 0) {
      return 0
    }
    if (currentIndex === 0 && step < 0) {
      return arrayLength - 1
    }

    return currentIndex + step
  }

  const switchFeature = (step: number) => {
    if (poiIndex !== null) {
      const newIndex = getNewIndex(step, featureLocations.length, poiIndex)

      const feature = featureLocations[newIndex]
      if (feature) {
        setCurrentFeature(feature)
        queryParams.set(locationName, feature.properties.urlSlug)
        updateQueryParams(queryParams)
      }
    }
  }

  const changeSnapPoint = (snapPoint: number) => {
    sheetRef.current?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
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
    languageCode
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!pois || (!poi && poiIndex)) {
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

  const sortedPois = featureLocations.sort((poi1: PoiFeature, poi2: PoiFeature) =>
    poi1.properties.title.localeCompare(poi2.properties.title)
  )
  const renderPoiListItem = (poi: PoiFeature) => (
    <PoiListItem key={poi.properties.path} poi={poi} selectFeature={selectFeature} queryParams={queryParams} />
  )
  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  const mapView = cityModel.boundingBox && (
    <MapView
      selectFeature={selectFeature}
      changeSnapPoint={changeSnapPoint}
      featureCollection={embedInCollection(sortedPois)}
      bboxViewport={moveViewToBBox(cityModel.boundingBox, defaultViewportConfig)}
      currentFeature={currentFeature}
      queryParams={queryParams}
      queryLocation={queryLocation}
      setQueryLocation={setQueryLocation}
    />
  )

  const navigation = (
    <>
      <NavItem onClick={() => switchFeature(-1)} role='button' tabIndex={0} onKeyPress={() => switchFeature(-1)}>
        <Icon src={iconArrowBack} alt='' />
        <Label>{t('detailsPreviousPoi')}</Label>
      </NavItem>
      <NavItem onClick={() => switchFeature(1)} role='button' tabIndex={0} onKeyPress={() => switchFeature(1)}>
        <Label>{t('detailsNextPoi')}</Label>
        <Icon src={iconArrowForward} alt='' />
      </NavItem>
    </>
  )

  const poiList = <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} borderless />
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
            mapView={mapView}
            poiList={poiList}
          />
        ) : (
          <PoisDesktop
            navigation={navigation}
            poi={poi}
            currentFeature={currentFeature}
            toolbar={toolbar}
            panelHeights={panelHeights}
            mapView={mapView}
            poiList={poiList}
            selectFeature={selectFeature}
            setQueryLocation={setQueryLocation}
          />
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </LocationLayout>
  )
}

export default PoisPage
