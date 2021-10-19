import distance from '@turf/distance'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  CityModel,
  embedInCollection,
  fromError,
  NotFoundError,
  PoiFeature,
  PoiModel,
  POIS_ROUTE,
  PoisRouteType,
  RouteInformationType
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import List from '../components/List'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import { PoiListItem } from '../components/PoiListItem'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { RoutePropType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useUserLocation, { LocationType } from '../hooks/useUserLocation'
import { LanguageResourceCacheStateType } from '../redux/StateType'

export type PropsType = {
  path: string | null | undefined
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  route: RoutePropType<PoisRouteType>
}

const CustomSheetList = styled.View`
  margin: 0 32px;
`

// Calculate distance for all Feature Locations
const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation?: LocationType | null): PoiFeature[] =>
  pois
    .map(poi => {
      const { featureLocation } = poi
      if (userLocation && featureLocation?.geometry.coordinates) {
        const distanceValue: string = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
        return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
      }
      return poi.featureLocation
    })
    .filter((feature): feature is PoiFeature => !!feature)

/**
 * Displays a list of pois or a single poi, matching the route /<location>/<language>/pois(/<id>)
 * cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean
 */

const Pois = ({ pois, language, path, cityModel, navigateTo, navigateToFeedback, route }: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const [selectedFeature, setSelectedFeature] = useState<PoiFeature | null>(null)
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const [featureLocations, setFeatureLocations] = useState<PoiFeature[]>(prepareFeatureLocations(pois))
  const { location, requestAndDetermineLocation } = useUserLocation(path === null)

  // set points to snap for bottom sheet
  const snapPoints = [dimensions.bottomSheetHandler.height, '35%', '95%']

  useEffect(() => {
    const featureLocations = prepareFeatureLocations(pois, location)
    const urlSlug = route.params.urlSlug
    if (urlSlug) {
      const currentFeature = featureLocations.find(feature => feature.properties.urlSlug === urlSlug)
      setSelectedFeature(currentFeature ?? null)
    }
    if (location) {
      setFeatureLocations(featureLocations)
    }
  }, [path, pois, route.params.urlSlug, location])

  const navigateToPoi = (cityCode: string, language: string, path: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    })
  }

  const navigateToPois = (cityCode: string, language: string, urlSlug: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      urlSlug
    })
  }

  const renderPoiListItem = (cityCode: string, language: string) => (poi: PoiFeature): ReactNode => {
    const { properties } = poi
    return (
      <PoiListItem
        key={properties.id}
        poi={poi}
        language={language}
        theme={theme}
        navigateToPoi={navigateToPoi(cityCode, language, properties.path)}
      />
    )
  }

  const navigateToFeedbackForPois = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
  }

  const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))

  if (path) {
    const poi = sortedPois.find(_poi => _poi.path === path)
    const feature = featureLocations.find(_feature => _feature.properties.path === path)

    if (poi && feature) {
      return (
        <ScrollView>
          <PoiDetails
            language={language}
            poi={poi}
            feature={feature}
            detailPage
            navigateToPois={navigateToPois(cityModel.code, language, poi.urlSlug)}
          />
          <SiteHelpfulBox
            backgroundColor={theme.colors.backgroundColor}
            navigateToFeedback={navigateToFeedbackForPois}
            theme={theme}
          />
        </ScrollView>
      )
    }

    const error = new NotFoundError({
      type: 'poi',
      id: path,
      city: cityModel.code,
      language
    })
    return <Failure code={fromError(error)} />
  }

  const poi = sortedPois.find(_poi => _poi.path === selectedFeature?.properties.path)

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      {cityModel.boundingBox && (
        <MapView
          boundingBox={cityModel.boundingBox}
          featureCollection={embedInCollection(featureLocations)}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          setSheetSnapPointIndex={setSheetSnapPointIndex}
          locationPermissionGranted={location !== null}
          onRequestLocationPermission={requestAndDetermineLocation}
          fabPosition={sheetSnapPointIndex < snapPoints.length - 1 ? snapPoints[sheetSnapPointIndex]! : 0}
        />
      )}
      <BottomActionsSheet
        title={selectedFeature ? selectedFeature.properties.title : t('sheetTitle')}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={snapPoints}>
        {selectedFeature && poi ? (
          <PoiDetails
            language={language}
            poi={poi}
            feature={selectedFeature}
            detailPage={false}
            navigateToPois={navigateToPois(cityModel.code, language, poi.urlSlug)}
          />
        ) : (
          <List
            CustomStyledList={CustomSheetList}
            noItemsMessage={t('currentlyNoPois')}
            items={featureLocations}
            renderItem={renderPoiListItem(cityModel.code, language)}
            theme={theme}
          />
        )}
        <SiteHelpfulBox
          backgroundColor={theme.colors.backgroundColor}
          navigateToFeedback={navigateToFeedbackForPois}
          theme={theme}
        />
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois
