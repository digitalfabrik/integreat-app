import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  RouteInformationType,
  TileModel,
  TU_NEWS_TYPE,
} from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import NavigationTiles from './NavigationTiles'

const Spacing = styled.View`
  padding: 10px;
`

type DashboardNavigationTilesProps = {
  cityModel: CityModel
  languageCode: string
  navigateTo: (routeInformation: RouteInformationType) => void
}

const DashboardNavigationTiles = ({
  cityModel,
  languageCode,
  navigateTo,
}: DashboardNavigationTilesProps): ReactElement => {
  const { t } = useTranslation('layout')

  const { featureFlags } = buildConfig()
  const { tunewsEnabled, localNewsEnabled, code: cityCode } = cityModel
  const isNewsEnabled = tunewsEnabled || localNewsEnabled
  const tiles = []

  if (cityModel.poisEnabled && featureFlags.pois) {
    tiles.push(
      new TileModel({
        title: t('locations'),
        path: 'pois',
        thumbnail: 'map-outline',
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: POIS_ROUTE,
            cityCode,
            languageCode,
          }),
      }),
    )
  }

  if (featureFlags.newsStream && isNewsEnabled) {
    tiles.push(
      new TileModel({
        title: t('news'),
        path: 'news',
        thumbnail: 'newspaper',
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: NEWS_ROUTE,
            cityCode,
            languageCode,
            newsType: localNewsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE,
          }),
      }),
    )
  }

  if (cityModel.eventsEnabled) {
    tiles.push(
      new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: 'calendar-blank-outline',
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: EVENTS_ROUTE,
            cityCode,
            languageCode,
          }),
      }),
    )
  }

  if (tiles.length === 0) {
    return <Spacing />
  }

  return <NavigationTiles tiles={tiles} />
}

export default DashboardNavigationTiles
