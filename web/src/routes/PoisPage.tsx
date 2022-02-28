import { BBox } from 'geojson'
import React, { ReactElement, useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WebMercatorViewport } from 'react-map-gl'
import { useNavigate, useParams } from 'react-router-dom'
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
import PoiPlaceholder from '../assets/PoiPlaceholderThumbnail.jpg'
import BottomActionSheet from '../components/BottomActionSheet'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import MapView from '../components/MapView'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import PoiListItem from '../components/PoiListItem'
import buildConfig from '../constants/buildConfig'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { useFeatureLocations } from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import { log } from '../utils/sentry'

const MapViewDesktopWrapper = styled.div`
  display: flex;
  ${`height: calc(100vh - 190px);`};
`

const ListViewWrapper = styled.div`
  overflow: auto;
  padding: 0 32px;
`

const ListHeader = styled.div`
  padding-top: 32px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 18px;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.textSecondaryColor};
  margin-bottom: 20px;
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
  const navigate = useNavigate()
  const { featureLocations, pois, poisError, loading } = useFeatureLocations(cityCode, languageCode)
  const { viewportSmall } = useWindowDimensions()
  const sheetRef = useRef<BottomSheetRef>(null)

  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(null)

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const poi = poiId && pois?.find((poi: PoiModel) => poi.path === pathname)

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

  const changeSnapPoint = (snapPoint: number) => {
    sheetRef.current?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
  }

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
              identifier={t('address')}
              information={location.location}
              link={featureLocation ? mapLink : undefined}
              linkLabel={t('map')}
            />
          )}
        </Page>
      </LocationLayout>
    )
  }

  const sortedPois = featureLocations.sort((poi1: PoiFeature, poi2: PoiFeature) =>
    poi1.properties.title.localeCompare(poi2.properties.title)
  )
  const renderPoiListItem = (poi: PoiFeature) => <PoiListItem key={poi.properties.path} properties={poi.properties} />
  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  const mapView = cityModel.boundingBox && (
    <MapView
      selectFeature={selectFeature}
      changeSnapPoint={changeSnapPoint}
      featureCollection={embedInCollection(sortedPois)}
      bboxViewport={moveViewToBBox(cityModel.boundingBox, defaultViewportConfig)}
      currentFeature={currentFeature}
    />
  )

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      {viewportSmall
        ? mapView
        : sortedPois.length > 0 && (
            <MapViewDesktopWrapper>
              <ListViewWrapper>
                <ListHeader>{currentFeature?.properties.title || t('listTitle')}</ListHeader>
                {!currentFeature && (
                  <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} borderless />
                )}
              </ListViewWrapper>
              {mapView}
            </MapViewDesktopWrapper>
          )}

      {viewportSmall && (
        <BottomActionSheet title={currentFeature?.properties.title || t('listTitle')} ref={sheetRef}>
          {sortedPois.length > 0 && !currentFeature && (
            <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} borderless />
          )}
          {/* TODO add feedback toolbar IGAPP-914 */}
        </BottomActionSheet>
      )}
    </LocationLayout>
  )
}

export default PoisPage
