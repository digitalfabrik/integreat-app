import distance from '@turf/distance'
import React, { ReactElement, ReactNode, useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Linking, ScrollView, View } from 'react-native'
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
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import { PoiListItem } from '../components/PoiListItem'
import { RoutePropType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useUserLocation, { LocationType } from '../hooks/useUserLocation'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'

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

const Spacer = styled.View`
  width: 20px;
  height: 20px;
`

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
  const [selectedFeature, setSelectedFeature] = useState<PoiFeature | null>(null)
  const [sheetIndex, setSheetIndex] = useState<number>(0)
  const [featureLocations, setFeatureLocations] = useState<PoiFeature[]>(prepareFeatureLocations(pois))
  const { location, requestAndDetermineLocation } = useUserLocation(path === null)

  // set points to snap for bottom sheet
  const snapPoints = useMemo(() => [dimensions.bottomSheetHandler.height, '25%', '95%'], [])

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
      location && setFeatureLocations(featureLocations)
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

  const navigateToPois = (cityCode: string, language: string, selectedPoiId: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      selectedPoiId
    })
  }

  const renderPoiListItem = (cityCode: string, language: string) => (poi: PoiFeature): ReactNode => (
    <PoiListItem
      key={poi.properties?.id}
      poi={poi}
      language={language}
      theme={theme}
      navigateToPoi={navigateToPoi(cityCode, language, poi.properties?.path)}
    />
  )

  const createNavigateToFeedbackForPoi = (poi: PoiModel) => (isPositiveFeedback: boolean): void => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      path: poi.path,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
  }

  const onChangeBottomSheet = (index: number) => {
    setSheetIndex(index)
  }

  const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))

  if (path) {
    const poi = sortedPois.find(_poi => _poi.path === path)

    if (poi) {
      const { location } = poi.location
      const files = resourceCache[poi.path] || {}

      let navigationUrl: string | undefined | null = null
      if (location && poi.featureLocation?.geometry.coordinates) {
        navigationUrl = getNavigationDeepLinks(location, poi.featureLocation.geometry.coordinates)
      }

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
              <PageDetail identifier={t('location')} information={location} theme={theme} language={language} />
            )}
            {navigationUrl && (
              <>
                <Button title={t('map')} onPress={navigateToPois(cityModel.code, language, String(poi.location.id))} />
                <Spacer />
                <Button title={t('navigation')} onPress={() => navigationUrl && Linking.openURL(navigationUrl)} />
              </>
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
      <View>
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
            fabPosition={sheetIndex < snapPoints.length - 1 ? snapPoints[sheetIndex] : 0}
          />
        )}
        <BottomActionsSheet
          headerText={t('sheetHeaderText')}
          onChange={onChangeBottomSheet}
          visible={!selectedFeature}
          snapPoints={snapPoints}
          content={
            <List
              CustomStyledList={CustomSheetList}
              noItemsMessage={t('currentlyNoPois')}
              items={featureLocations}
              renderItem={renderPoiListItem(cityModel.code, language)}
              theme={theme}
            />
          }
        />
      </View>
    </ScrollView>
  )
}

export default Pois
