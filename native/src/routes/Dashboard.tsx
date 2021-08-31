import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import Categories from '../components/Categories'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import NavigationTiles from '../components/NavigationTiles'
import TileModel from '../models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import newsIcon from '../assets/news.svg'
import { useTranslation } from 'react-i18next'
import buildConfig from '../constants/buildConfig'
import SpaceBetween from '../components/SpaceBetween'
import styled from 'styled-components/native'
import { FeedbackInformationType } from '../components/FeedbackContainer'
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
import testID from '../testing/testID'
import { useTheme } from 'styled-components'

const Spacing = styled.View`
  padding: 10px;
`
type PropsType = {
  navigateTo: (arg0: RouteInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
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
  navigateToLink,
  navigateToFeedback
}: PropsType): ReactElement => {
  const { t } = useTranslation('dashboard')
  const theme = useTheme()

  const getNavigationTileModels = useCallback((): Array<TileModel> => {
    const { featureFlags } = buildConfig()
    const { tunewsEnabled, pushNotificationsEnabled, code: cityCode } = cityModel
    const isNewsEnabled = tunewsEnabled || pushNotificationsEnabled
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
              newsType: pushNotificationsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE
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
      {navigationTiles.length > 0 ? (
        <NavigationTiles tiles={navigationTiles} theme={theme} language={language} />
      ) : (
        <Spacing />
      )}
      <Categories
        stateView={stateView}
        resourceCache={resourceCache}
        resourceCacheUrl={resourceCacheUrl}
        language={language}
        cityModel={cityModel}
        theme={theme}
        navigateTo={navigateTo}
        navigateToFeedback={navigateToFeedback}
        navigateToLink={navigateToLink}
      />
    </SpaceBetween>
  )
}

export default Dashboard
