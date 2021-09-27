import distance from '@turf/distance'
import type { Feature, Point } from 'geojson'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useTheme } from 'styled-components'

import {
  CityModel,
  embedInCollection,
  fromError,
  NotFoundError,
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
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import PoiListItem from '../components/PoiListItem'
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
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  route: RoutePropType<PoisRouteType>
}

// Calculate distance for all Feature Locations
const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation?: LocationType | null): Feature<Point>[] => {
  if (userLocation) {
    const currentPosition = [userLocation[0], userLocation[1]]
    return pois
      .map(poi => {
        const featureLocation = poi.featureLocation as Feature<Point>
        if (featureLocation?.geometry?.coordinates) {
          const distanceValue: string = distance(currentPosition, featureLocation.geometry.coordinates).toFixed(1)
          return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
        } else {
          return poi.featureLocation
        }
      })
      .filter((feature): feature is Feature<Point> => !!feature)
  }
  return pois.map(poi => poi.featureLocation).filter((feature): feature is Feature<Point> => !!feature)
}

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
  navigateToLink,
  route
}: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null)
  const [featureLocations, setFeatureLocations] = useState<Feature<Point>[]>(prepareFeatureLocations(pois))
  const { location, requestAndDetermineLocation } = useUserLocation(path === null)

  useEffect(() => {
    const featureLocations = prepareFeatureLocations(pois, location)
    const selectedPoiId = Number(route.params.selectedPoiId)
    if (selectedPoiId) {
      const currentFeature: Feature<Point> | undefined = featureLocations.find(
        feature => feature.properties?.id === Number(route.params.selectedPoiId)
      )
      currentFeature && setSelectedFeature(currentFeature)
    }
    location && setFeatureLocations(featureLocations)
  }, [pois, route.params.selectedPoiId, location])

  const navigateToPoi = (cityCode: string, language: string, path: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    })
  }

  const navigateToPois = (cityCode: string, language: string, selectedPoiId: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      selectedPoiId
    })
  }

  const renderPoiListItem = (cityCode: string, language: string) => (poi: PoiModel): ReactNode => {
    return (
      <PoiListItem
        key={poi.path}
        poi={poi}
        language={language}
        theme={theme}
        navigateToPoi={navigateToPoi(cityCode, language, poi.path)}
      />
    )
  }

  const createNavigateToFeedbackForPoi = (poi: PoiModel) => (isPositiveFeedback: boolean): void => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      path: poi.path,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
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
      const location = poi.location.location
      const files = resourceCache[poi.path] || {}
      return (
        <Page
          content={poi.content}
          title={poi.title}
          lastUpdate={poi.lastUpdate}
          language={language}
          files={files}
          theme={theme}
          resourceCacheUrl={resourceCacheUrl}
          navigateToLink={navigateToLink}
          navigateToFeedback={createNavigateToFeedbackForPoi(poi)}>
          <>
            {location && (
              <PageDetail
                identifier={t('location')}
                information={location}
                theme={theme}
                language={language}
                linkLabel={poi?.featureLocation && t('map')}
                onLinkClick={navigateToPois(cityModel.code, language, String(poi.location.id))}
              />
            )}
          </>
        </Page>
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
