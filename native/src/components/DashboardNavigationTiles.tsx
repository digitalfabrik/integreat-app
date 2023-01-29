import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  CityModel,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  RouteInformationType,
  TU_NEWS_TYPE,
} from 'api-client'

import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import buildConfig from '../constants/buildConfig'
import TileModel from '../models/TileModel'
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
  const { t } = useTranslation('dashboard')

  const { featureFlags } = buildConfig()
  const { tunewsEnabled, localNewsEnabled, code: cityCode } = cityModel
  const isNewsEnabled = tunewsEnabled || localNewsEnabled
  const tiles = []

  if (featureFlags.newsStream && isNewsEnabled) {
    tiles.push(
      new TileModel({
        title: t('news'),
        path: 'news',
        thumbnail: newsIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: NEWS_ROUTE,
            cityCode,
            languageCode,
            newsType: localNewsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE,
          }),
        notifications: 0,
      })
    )
  }

  if (cityModel.eventsEnabled) {
    tiles.push(
      new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: eventsIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: EVENTS_ROUTE,
            cityCode,
            languageCode,
          }),
        notifications: 0,
      })
    )
  }

  if (cityModel.offersEnabled) {
    tiles.push(
      new TileModel({
        title: t('offers'),
        path: 'offers',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: OFFERS_ROUTE,
            cityCode,
            languageCode,
          }),
        notifications: 0,
      })
    )
  }

  if (cityModel.poisEnabled && featureFlags.pois) {
    tiles.push(
      new TileModel({
        title: t('pois'),
        path: 'pois',
        thumbnail: poisIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: POIS_ROUTE,
            cityCode,
            languageCode,
          }),
        notifications: 0,
      })
    )
  }

  if (tiles.length === 0) {
    return <Spacing />
  }

  return <NavigationTiles tiles={tiles} />
}

export default DashboardNavigationTiles
