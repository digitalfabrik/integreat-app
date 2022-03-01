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
import FeedbackModal from '../components/FeedbackModal'
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
import DateFormatterContext from '../contexts/DateFormatterContext'
import { useFeatureLocations } from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import { log } from '../utils/sentry'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const ListViewWrapper = styled.div<{ panelHeights: number }>`
  min-width: 370px;
  padding: 0 32px;
  overflow: auto;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px - ${dimensions.toolbarHeight}px);`};
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: 1px 0px 4px 0px rgba(0, 0, 0, 0.2);
`

const ListHeader = styled.div`
  padding-top: 32px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 18px;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.textDecorationColor};
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
  const [feedbackModalRating, setFeedbackModalRating] = useState<FeedbackRatingType | null>(null)

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

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} iconDirection='row' />
  )

  const feedbackModal = feedbackModalRating ? (
    <FeedbackModal
      cityCode={cityModel.code}
      language={languageCode}
      routeType={POIS_ROUTE}
      feedbackRating={feedbackModalRating}
      closeModal={() => setFeedbackModalRating(null)}
    />
  ) : null

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

  const poiList = <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} borderless />
  // To get the map fullheight its reduced by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.footerHeight + dimensions.navigationMenuHeight

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <>
            {mapView}
            <BottomActionSheet
              title={currentFeature?.properties.title || t('listTitle')}
              toolbar={toolbar(setFeedbackModalRating)}
              ref={sheetRef}>
              {sortedPois.length > 0 && !currentFeature && poiList}
            </BottomActionSheet>
          </>
        ) : (
          <>
            <div>
              <ListViewWrapper panelHeights={panelHeights}>
                <ListHeader>{currentFeature?.properties.title || t('listTitle')}</ListHeader>
                {!currentFeature && sortedPois.length > 0 && poiList}
              </ListViewWrapper>
              <ToolbarContainer> {toolbar(setFeedbackModalRating)}</ToolbarContainer>
            </div>
            {mapView}
          </>
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </LocationLayout>
  )
}

export default PoisPage
