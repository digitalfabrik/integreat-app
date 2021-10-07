import distance from '@turf/distance'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useTheme } from 'styled-components'

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

import Caption from '../components/Caption'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import List from '../components/List'
import MapView from '../components/MapView'
import PoiListItem from '../components/PoiListItem'
import PoiPage from '../components/PoiPage'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import { RoutePropType } from '../constants/NavigationTypes'
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
  route: RoutePropType<PoisRouteType>
}

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

const Pois = ({
  pois,
  language,
  path,
  cityModel,
  resourceCache,
  resourceCacheUrl,
  navigateTo,
  navigateToFeedback,
  route
}: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const [selectedFeature, setSelectedFeature] = useState<PoiFeature | null>(null)
  const [featureLocations, setFeatureLocations] = useState<PoiFeature[]>(prepareFeatureLocations(pois))
  const { location, requestAndDetermineLocation } = useUserLocation(path === null)

  useEffect(() => {
    if (!path) {
      const featureLocations = prepareFeatureLocations(pois, location)
      const selectedPoiId = Number(route.params.selectedPoiId)
      if (selectedPoiId) {
        const currentFeature = featureLocations.find(
          feature => feature.properties.id === Number(route.params.selectedPoiId)
        )
        setSelectedFeature(currentFeature ?? null)
      }
      if (location) {
        setFeatureLocations(featureLocations)
      }
    }
  }, [path, pois, route.params.selectedPoiId, location])

  const navigateToPoi = (cityCode: string, language: string, path: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    })
  }

  const renderPoiListItem = (cityCode: string, language: string) => (poi: PoiModel): ReactNode => {
    const { path } = poi
    return (
      <PoiListItem
        key={path}
        poi={poi}
        language={language}
        theme={theme}
        navigateToPoi={navigateToPoi(cityCode, language, path)}
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
    if (poi) {
      return (
        <PoiPage
          poi={poi}
          resourceCache={resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          language={language}
          cityModel={cityModel}
          navigateTo={navigateTo}
          navigateToFeedback={navigateToFeedback}
          theme={theme}
          t={t}
        />
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

  return (
    <ScrollView>
      <SpaceBetween>
        <View>
          <Caption title={t('poi')} theme={theme} />
          {cityModel.boundingBox && (
            <MapView
              boundingBox={cityModel.boundingBox}
              featureCollection={embedInCollection(featureLocations)}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              navigateTo={navigateTo}
              language={language}
              cityCode={cityModel.code}
              locationPermissionGranted={location !== null}
              onRequestLocationPermission={requestAndDetermineLocation}
            />
          )}
          <List
            noItemsMessage={t('currentlyNoPois')}
            items={sortedPois}
            renderItem={renderPoiListItem(cityModel.code, language)}
            theme={theme}
          />
        </View>
        <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForPois} theme={theme} />
      </SpaceBetween>
    </ScrollView>
  )
}

export default Pois
