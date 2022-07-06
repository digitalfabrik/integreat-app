import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  CityModel,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  RouteInformationType,
  TU_NEWS_TYPE
} from 'api-client'

import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import Categories from '../components/Categories'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import NavigationTiles from '../components/NavigationTiles'
import SpaceBetween from '../components/SpaceBetween'
import buildConfig from '../constants/buildConfig'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import TileModel from '../models/TileModel'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import testID from '../testing/testID'

const Spacing = styled.View`
  padding: 10px;
`
type PropsType = {
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  language: string
  cityModel: CityModel
  stateView: CategoriesRouteStateView
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
}

const Dashboard = ({
  cityModel,
  language,
  stateView,
  resourceCache,
  resourceCacheUrl,
  navigateTo,
  navigateToFeedback
}: PropsType): ReactElement => {
  const { t } = useTranslation('dashboard')
  const theme = useTheme()

  const getNavigationTileModels = useCallback((): Array<TileModel> => {
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
              languageCode: language,
              newsType: localNewsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE
            }),
          notifications: 0
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
              languageCode: language
            }),
          notifications: 0
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
              languageCode: language
            }),
          notifications: 0
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
              languageCode: language
            }),
          notifications: 0
        })
      )
    }

    return tiles
  }, [cityModel, language, navigateTo, t])

  const navigationTiles = getNavigationTileModels()
  return (
    <SpaceBetween {...testID('Dashboard-Page')}>
      {navigationTiles.length > 0 ? <NavigationTiles tiles={navigationTiles} theme={theme} /> : <Spacing />}
      <Categories
        stateView={stateView}
        resourceCache={resourceCache}
        resourceCacheUrl={resourceCacheUrl}
        language={language}
        cityModel={cityModel}
        navigateTo={navigateTo}
        navigateToFeedback={navigateToFeedback}
      />
    </SpaceBetween>
  )
}

export default Dashboard
